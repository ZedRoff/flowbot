
import pygame
import time
import sqlite3
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
import schedule
con = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('launch_reveil', __name__)





def get_alarms_from_db():
    cursor = con.cursor()
    cursor.execute('SELECT time FROM reveil ORDER BY time')
    alarms = cursor.fetchall()
    cursor.close()
    return alarms
def delete_alarm_from_db(alarm_time):
    with con:
        con.execute('DELETE FROM reveil WHERE time = ?', (alarm_time,))

def play_alarm():
    alarm_time = datetime.now().strftime("%H:%M")
    print("C'est l'heure! Réveillez-vous!")
    pygame.mixer.music.load("alarm_sound.mp3")
    pygame.mixer.music.play()
    time.sleep(5)  # Joue le son pendant 5 secondes
    pygame.mixer.music.stop()
    delete_alarm_from_db(alarm_time)
    # remove alarm from schedule with tag alarm_time
    schedule.clear(alarm_time)
    print("Alarme supprimée.")

def set_alarms():
    alarms = get_alarms_from_db()
    for alarm in alarms:
        alarm_time = alarm[0]
        schedule.every().day.at(alarm_time).do(play_alarm).tag(alarm_time)

started = False
@bp.route('/api/launch_reveil', methods=['POST'])
def set_alarm():
    global started
    if started:
        return jsonify({'error': 'Le réveil est déjà en cours.'})
    
    while True:
        set_alarms()
        started = True
        schedule.run_pending()
        print("Waiting...")
        time.sleep(1)

