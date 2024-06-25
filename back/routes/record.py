import sounddevice as sd
import wavio
import numpy as np
import threading
from flask import Flask, Blueprint, jsonify, request
import os
import uuid
import sqlite3
from flask_socketio import SocketIO, emit

db = sqlite3.connect("./db/database.db", check_same_thread=False)

app = Flask(__name__)

fs = 44100  # Fréquence d'échantillonnage
recording = None
is_recording = False
recording_thread = None
play_thread = None

bp = Blueprint('record', __name__)

def record_voice():
    global recording, is_recording
    recording = []
    is_recording = True
    print("L'enregistrement commence...")

    def callback(indata, frames, time, status):
        if is_recording:
            recording.append(indata.copy())

    with sd.InputStream(samplerate=fs, channels=2, dtype=np.int16, callback=callback):
        while is_recording:
            sd.sleep(100)  

    print("Enregistrement terminé.")
    recording = np.concatenate(recording)
    return jsonify({'result': 'success'})
def save_audio(filename, recording, fs):
    wavio.write(filename, recording, fs, sampwidth=2)
    print(f"L'audio a été sauvegardé dans le fichier {filename}")

def play_audio(filename):
    global play_thread
    try:
        file_path = f'./uploads/enregistrements/{filename}'
        if not os.path.exists(file_path):
            print(f'Fichier non trouvé : {file_path}')
            return

        audio = wavio.read(file_path).data
        cur = db.cursor()
        cur.execute("SELECT voice FROM muted")
        
        sd.play(audio, fs)
        muted = cur.fetchone()
        if muted[0] == "on":
            sd.volume = 0
        else:
            sd.volume = 1
        
        sd.wait()  
        print('Audio joué avec succès.')
    except Exception as e:
        print(f'Erreur lors de la lecture de l\'audio : {e}')
    finally:
        play_thread = None  

@bp.route('/api/record', methods=['POST'])
def start_record():
    global recording_thread, is_recording
    if is_recording:
        return jsonify({'result': 'Un enregistrement est déjà en cours.'})

    recording_thread = threading.Thread(target=record_voice)
    recording_thread.start()
    return jsonify({'result': 'Enregistrement commencé.'})

@bp.route('/api/stopRecord', methods=['POST'])
def stop_record():
    global is_recording, recording
   
    filename = f"{uuid.uuid4().hex}.wav"

    if is_recording:
        is_recording = False
        recording_thread.join()  

        if recording is not None:
            save_audio(f'./uploads/enregistrements/{filename}', recording, fs)
            emit('message', {"from": "back", "type": "recordings_update"}, broadcast=True, namespace='/')
            return jsonify({'result': 'Audio sauvegardé avec succès.'})
    
    return jsonify({'result': 'Aucun enregistrement à sauvegarder.'})

@bp.route('/api/playRecord', methods=['POST'])
def play_record():
    global play_thread
    data = request.get_json()
    filename = data['filename']
    try:
        if play_thread is not None and play_thread.is_alive():
            return jsonify({'message': 'Une lecture est déjà en cours.'})
        
        play_thread = threading.Thread(target=play_audio, args=(filename,))
        play_thread.start()
        return jsonify({'message': 'Lecture audio commencée.'})
    except Exception as e:
        return jsonify({'message': 'Erreur lors du démarrage de la lecture audio.', 'error': str(e)})


@bp.route('/api/deleteRecord', methods=['POST'])
def delete_record():
    data = request.get_json()
    filename = data['filename']
    file_path = f'./uploads/enregistrements/{filename}'

    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({'result': 'success'})
    else:
        return jsonify({'result': 'Fichier non trouvé.'})