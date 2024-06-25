from flask import Blueprint, jsonify, send_from_directory, request
import os
import pygame
import sqlite3

db = sqlite3.connect("./db/database.db", check_same_thread=False)

bp = Blueprint('play_sound', __name__)

@bp.route('/api/playSound', methods=['POST'])
def play_sound():
    data = request.get_json()
    sound = data['sound']
    sound ="./audios/"+sound

    cur = db.cursor()
    cur.execute("SELECT voice FROM muted")
    muted=cur.fetchone()
    print(muted)
    if muted[0] == "on":
        return jsonify({"status": "muted"})

    pygame.mixer.init()
    pygame.mixer.music.load(sound)
    pygame.mixer.music.play()
    return jsonify({"status": "success"})

