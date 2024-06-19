import yt_dlp
import os
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
import pygame
import time
from moviepy.editor import AudioFileClip
from youtubesearchpython import VideosSearch
from flask import Blueprint, request, jsonify
import sqlite3
import os
from flask_socketio import SocketIO, emit
from threading import Lock

db = sqlite3.connect("./db/database.db", check_same_thread=False)
db_lock = Lock()
duration = 0
title = ""
elapsed_time = 0
last_start_time = 0
is_paused = False
image = ""
status = "stop"

def download_audio(link):
    global title, duration, image, status
    # stop previous audio
    pygame.mixer.quit()

    # delete previous audio file
    if os.path.exists("file.webm"):
        os.remove("file.webm")
    if os.path.exists("file.wav"):
        os.remove("file.wav")

    try:
        with yt_dlp.YoutubeDL({'extract_audio': True, 'format': 'bestaudio', 'outtmpl': 'file.webm'}) as video:
            info_dict = video.extract_info(link, download=True)
            title = info_dict.get('title', None)
            duration = info_dict.get('duration', None)
            image = info_dict.get('thumbnail', None)
            status = "play"
            emit('message', {"from": "mobile", "message": "music_play", "type": "music_play", "title": title, "duration": duration, "status": status}, broadcast=True, namespace='/')
            
    except Exception as e:
        print("Erreur lors du téléchargement audio:", e)
        return None

def convert_webm_to_wav(input_file, output_file):
    try:
        clip = AudioFileClip(input_file)
        clip.write_audiofile(output_file)
        print("Conversion terminée ! Le fichier WAV est disponible dans :", output_file)
    except Exception as e:
        print("Erreur lors de la conversion audio:", e)

bp = Blueprint('play_audio', __name__)

@bp.route('/api/playAudio', methods=['POST'])
def play_audio():
    global title, duration, elapsed_time, last_start_time, is_paused, image, status
    if request.method == 'POST':

        data = request.get_json()
        # 
        videosSearch = VideosSearch(data["query"], limit=1)
        download_audio(videosSearch.result()['result'][0]["link"])
        pygame.mixer.init()

        convert_webm_to_wav('file.webm', "file.wav")
        pygame.mixer.music.load("file.wav")
        pygame.mixer.music.play()

        elapsed_time = 0
        last_start_time = time.time()
        is_paused = False

        with db_lock:
            cur = db.cursor()
            cur.execute("UPDATE musiques SET active = 1")
            db.commit()
            cur.close()

        try:
            while True:
                time.sleep(0.1)
                # Update elapsed time if not paused
                if not is_paused:
                    elapsed_time += time.time() - last_start_time
                    last_start_time = time.time()
                print("Elapsed time: {}".format(elapsed_time))
                # Emit the elapsed time
                
                emit('message', {"from": "back", "type": "music_update", "title": title, "duration": duration, "elapsed_time": elapsed_time, "image": image, "status": status}, broadcast=True, namespace='/')

                with db_lock:
                    cur = db.cursor()
                    active = cur.execute("SELECT active FROM musiques").fetchone()
                    cur.close()

                if active[0] == 0:
                    pygame.mixer.music.stop()
                    emit('message', {"from": "back", "type": "music_update", "title": "", "duration": 1, "elapsed_time": 0, "image": ""}, broadcast=True, namespace='/')

                    break
                elif active[0] == 2:
                    is_paused = True
                    pygame.mixer.music.pause()
                    status = "pause"
                elif active[0] == 3:
                    is_paused = False
                    last_start_time = time.time()
                    status = "play"
                    pygame.mixer.music.unpause()

                # Check if music has finished playing
                if not pygame.mixer.music.get_busy() and active[0] == 1:
                    break

        except Exception as e:
            print("Erreur lors de la lecture audio:", e)
        finally:
            pygame.quit()

    return jsonify({"status": "success"})

@bp.route('/api/pauseAudio', methods=['POST'])
def pause_audio():
    if request.method == 'POST':
        with db_lock:
            cur = db.cursor()
            cur.execute("UPDATE musiques SET active = 2")
            db.commit()
            cur.close()
        return jsonify({"status": "success"})

@bp.route('/api/resumeAudio', methods=['POST'])
def resume_audio():
    if request.method == 'POST':
        with db_lock:
            cur = db.cursor()
            cur.execute("UPDATE musiques SET active = 3")
            db.commit()
            cur.close()
        return jsonify({"status": "success"})

@bp.route('/api/stopAudio', methods=['POST'])
def stop_audio():
    if request.method == 'POST':
        with db_lock:
            cur = db.cursor()
            cur.execute("UPDATE musiques SET active = 0")
            db.commit()
            cur.close()
        
        return jsonify({"status": "success"})

@bp.route('/api/changeVolume', methods=['POST'])
def change_volume():
    if request.method == 'POST':
        try:
            pygame.mixer.init()
            data = request.get_json()
            volume = data["volume"]
            pygame.mixer.music.set_volume(volume)
            return jsonify({"status": "success"})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
