import yt_dlp
import pygame
import time
from moviepy.editor import AudioFileClip
from youtubesearchpython import VideosSearch
from flask import Blueprint, request, jsonify
import sqlite3
import os
from flask_socketio import SocketIO as socketio

db = sqlite3.connect("./db/database.db", check_same_thread=False)

def download_audio(link):
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
            
            socketio.emit('message', {"from": "mobile", "message": "music_play", "type": "music_download", "title": title, "duration": duration})
          
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

db = sqlite3.connect("./db/database.db", check_same_thread=False)

bp = Blueprint('play_audio', __name__)

@bp.route('/api/playAudio', methods=['POST'])
def play_audio():
    if request.method == 'POST':
        data = request.get_json()
        videosSearch = VideosSearch(data["query"], limit=2)
        download_audio(videosSearch.result()['result'][0]["link"])
        pygame.mixer.init()
     
        convert_webm_to_wav('file.webm', "file.wav")
        pygame.mixer.music.load("file.wav")
        pygame.mixer.music.play()
        cur = db.cursor()
        cur.execute("UPDATE musiques SET active = 1")
        cur.close()

        try:
            
            while True:
                time.sleep(0.1)
                # check if the music has ended
                if not pygame.mixer.music.get_busy():
                    break
                cur = db.cursor()
                active = cur.execute("SELECT active FROM musiques").fetchone()
                cur.close()
                print(active)
                if active[0] == 1 and not pygame.mixer.music.get_busy():
                    pygame.mixer.music.play()
                elif active[0] == 2:
                    pygame.mixer.music.pause()
                elif active[0] == 3:
                    pygame.mixer.music.unpause()
                    cur = db.cursor()
                    cur.execute("UPDATE musiques SET active = 1")
                    cur.close()
                elif active[0] == 0:
                    pygame.mixer.music.stop()
                    break

                
        except Exception as e:
            print("Erreur lors de la lecture audio:", e)
        finally:
            pygame.quit()
      

@bp.route('/api/pauseAudio', methods=['POST'])
def pause_audio():
    if request.method == 'POST':
        cur = db.cursor()
        cur.execute("UPDATE musiques SET active = 2")
        cur.close()
        return jsonify({"status": "success"})
    
@bp.route('/api/resumeAudio', methods=['POST'])
def resume_audio():
    if request.method == 'POST':
        cur = db.cursor()
        cur.execute("UPDATE musiques SET active = 3")
        cur.close()
        return jsonify({"status": "success"})

@bp.route('/api/stopAudio', methods=['POST'])
def stop_audio():
    if request.method == 'POST':
        cur = db.cursor()
        cur.execute("UPDATE musiques SET active = 0")
        cur.close()
        return jsonify({"status": "success"})

@bp.route('/api/changeVolume', methods=['POST'])
def change_volume():
    if request.method == 'POST':
        try:
            pygame.mixer.init()
            data = request.get_json()
            volume = data["volume"]
            print(volume)
            pygame.mixer.music.set_volume(volume)
            return jsonify({"status": "success"})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)})
