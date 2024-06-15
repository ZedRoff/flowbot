#import RPi.GPIO as GPIO

import os
import json
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import sqlite3
from dotenv import dotenv_values
from flask import request

import time
from threading import Thread
import requests

import threading


from datetime import datetime
from playsound import playsound
import pygame

pygame.mixer.init()

# Charger les configurations depuis .env
config = dotenv_values(".env")

# Initialiser la base de données
con = sqlite3.connect("./db/database.db", check_same_thread=False)
cur = con.cursor()

# Création des tables si elles n'existent pas
cur.execute("DROP TABLE IF EXISTS musiques")
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS commandes(
    uuid TEXT PRIMARY KEY,
    name TEXT,
    reply TEXT     
)''')

cur.execute('''
    CREATE TABLE IF NOT EXISTS global(
    action TEXT PRIMARY KEY
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS son(
    currentVolMusic FLOAT PRIMARY KEY,
    currentVolGeneral FLOAT,
    currentVolNotification FLOAT
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS chronometre(
    active INTEGER PRIMARY KEY
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS musiques(
    active INTEGER PRIMARY KEY
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS minuteur(
    min TEXT PRIMARY KEY,
    active INTEGER
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS devoirs(
    lundi TEXT,
    mardi TEXT,
    mercredi TEXT,
    jeudi TEXT,
    vendredi TEXT,
    samedi TEXT,
    dimanche TEXT
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS reveil(
    time TEXT PRIMARY KEY
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS rappels(
    text TEXT,
    date TEXT,
    color TEXT    
            )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS background(
    color1 TEXT,
    color2 TEXT
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS positions(
    liste TEXT
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS feeds(
    url TEXT PRIMARY KEY
    )
''')
con.commit()

cur.execute('''
    CREATE TABLE IF NOT EXISTS starter(
    has_finished INTEGER PRIMARY KEY
    )
''')
con.commit()

cur.execute('''
CREATE TABLE IF NOT EXISTS preferences(
            voice TEXT,
            name TEXT
)
            ''')
con.commit()
cur.execute('''
            CREATE TABLE IF NOT EXISTS city(
            city TEXT
            )
            ''')
con.commit()



cur.execute('''
 CREATE TABLE IF NOT EXISTS days(
            id TEXT PRIMARY KEY,
            name TEXT,
            day TEXT,
            f TEXT,
            t TEXT
 )
            ''')
con.commit()

cur.execute('''
CREATE TABLE IF NOT EXISTS fiches(
            type TEXT,
            title TEXT,
            content TEXT,
            fiche TEXT,
            description TEXT
            )
            ''')
con.commit()
cur.execute('''
            CREATE TABLE IF NOT EXISTS qcm(
            question TEXT,
           
            choix TEXT,
            titre TEXT
            )
            ''')
con.commit()
cur.execute('''
            CREATE TABLE IF NOT EXISTS categories(
            name TEXT
            )
            ''')
con.commit()
cur.execute('''
CREATE TABLE IF NOT EXISTS tasks(
            name TEXT,
            category TEXT,
            status TEXT
            )
            ''')
con.commit()

cur.execute('''
CREATE TABLE IF NOT EXISTS notes(
    matiere TEXT,
    note INTEGER,
    coefficient INTEGER,
    locked INTEGER
)
''')
con.commit()



# Vérifier si les tables sont vides, si oui, insérer les valeurs par défaut


res_test = cur.execute("SELECT * FROM minuteur").fetchone()
if res_test is None:
    cur.execute("INSERT INTO minuteur VALUES (?, ?)", ("", 0))
    con.commit()



res_test = cur.execute("SELECT * FROM background").fetchone()
if res_test is None:
    cur.execute("INSERT INTO background VALUES (?, ?)", ("#6d0069", "#000b60"))
    con.commit()

res_test = cur.execute("SELECT action FROM global").fetchone()
if res_test is None:
    cur.execute("INSERT INTO global VALUES (?)", ("",))
    con.commit()

res_test = cur.execute("SELECT active FROM chronometre").fetchone()
if res_test is None:
    cur.execute("INSERT INTO chronometre VALUES (?)", (0,))
    con.commit()

res_test = cur.execute("SELECT active FROM musiques").fetchone()
if res_test is None:
    cur.execute("INSERT INTO musiques VALUES (?)", (0,))
    con.commit()

res_test = cur.execute("SELECT * FROM devoirs").fetchone()
if res_test is None:
    cur.execute("INSERT INTO devoirs VALUES (?, ?, ?, ?, ?, ?, ?)", ("", "", "", "", "", "", ""))
    con.commit()



res_test = cur.execute("SELECT * FROM son").fetchone()
if res_test is None:
    cur.execute("INSERT INTO son VALUES (?,?,?)", (0.8,0.8,0.8))
    con.commit()

res_test = cur.execute("SELECT * FROM feeds").fetchone()    
if res_test is None:
    cur.execute("INSERT INTO feeds VALUES (?)", ("https://www.lemonde.fr/rss/une.xml",))
    con.commit()

res_test = cur.execute("SELECT * FROM starter").fetchone()
if res_test is None:
    cur.execute("INSERT INTO starter VALUES (?)", (0,))
    con.commit()

res_test = cur.execute("SELECT * FROM preferences").fetchone()
if res_test is None:
    cur.execute("INSERT INTO preferences VALUES (?, ?)", ("male", "User"))
    con.commit()

res_test = cur.execute("SELECT * FROM city").fetchone()
if res_test is None:
    cur.execute("INSERT INTO city VALUES (?)", ("Paris",))
    con.commit()







# Réinitialiser les valeurs à chaque lancement
cur.execute("UPDATE musiques SET active = ?", (0,))
con.commit()
cur.execute("UPDATE chronometre SET active = ?", (0,))
con.commit()
cur.execute("UPDATE global SET action = ?", ("",))
con.commit()

# Fermer correctement les connexions
cur.close()


# Initialiser Flask et SocketIO
app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = config.get('SECRET')
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Liste pour stocker les utilisateurs connectés
connected_users = []

def import_routes():
    routes_dir = os.path.join(os.path.dirname(__file__), 'routes')
    for filename in os.listdir(routes_dir):
        if filename.endswith('.py'):
            module_name = filename[:-3]
            module = __import__(f'routes.{module_name}', fromlist=[''])
            app.register_blueprint(module.bp)
import_routes()

# Charger l'URL depuis config.json
with open('../config.json') as config_file:
    config_data = json.load(config_file)
    host = config_data.get('URL')

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    connected_users.append({"id": request.sid})
    

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    
    for user in connected_users:
        if user["id"] == request.sid:
            # user["type"] throws a KeyErrror
            if "type" in user:

                socketio.emit('message', {"from": "back", "type": "mobile_status_change", "message": False})
                connected_users.remove(user)

@socketio.on('message')
def handle_message(message):


    who = message["from"]
    msg = message["message"]
   
    if who == "bot" and msg == "check_mobile_connected":
        flag = False
        for user in connected_users:
            print(user)
            if "type" in user and user["type"] == "mobile":
                flag = True
        socketio.emit("message", {"from": "back", "type": "check_mobile_connected", "message": flag })
    elif who == "mobile" and msg == "mobile_connected":
        connected_users[len(connected_users)-1]["type"] = "mobile"
        socketio.emit('message', {"from": "back", "type": "mobile_status_change", "message": True})
    elif who == "mobile" and msg == "city_changed":
        socketio.emit("message", {"from": "back", "type": "city_changed", "message": message["city"]})
    elif who == "mobile" and msg == "starter_finished":
        socketio.emit("message", {"from": "back", "type": "starter_finished", "message": "starter_finished"})
    elif who == "bot" and msg == "bot_connected":
        connected_users[len(connected_users)-1]["type"] = "bot"
        socketio.emit('message', {"from": "back", "type": "bot_status_change", "message": True})
    elif who == "mobile" and msg == "music_play":
        socketio.emit("message", {"from": "back", "type": "music_play", "title": message["title"], "duration": message["duration"]})
    







'''

#Setup port name
GPIO.setmode(GPIO.BOARD)
 
#Setup port (pull down = btn)
GPIO.setup(11,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(13,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(15,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(36,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)


molette_appuyer = False
action_appuyer = False

def run_molette():
     
     while(True):
          time.sleep(0.001)
          if not GPIO.input(13) and GPIO.input(15):
               data = {
                   "message": "GAUCHE",
                   "from": "back",
                   "type": "molette"
               }
               requests.post("http://"+host+":5000/api/send_message",json=data)
               time.sleep(0.5)
          elif not GPIO.input(15) and GPIO.input(13):
               data = {
                   "message": "DROITE",
                   "from": "back",
                   "type": "molette"
               }
               requests.post("http://"+host+":5000/api/send_message",json=data)
               time.sleep(0.5)
def run_bouttons():
     global molette_appuyer, action_appuyer
     while(True):                                                                                                                           
          time.sleep(0.1)
          if GPIO.input(36) and not molette_appuyer:
               data = {
                   "from": "back",
                   "message": "APPUI",
                   "type": "bouton_molette"
               }
               requests.post("http://"+host+":5000/api/send_message",json=data)
               molette_appuyer = True
          elif not GPIO.input(36) and molette_appuyer:
               data = {
                   "message": "RELACHE", 
                   "from": "back",
                   "type": "bouton_molette"
               }
               requests.post("http://"+host+":5000/api/send_message",json=data)
               molette_appuyer = False
          if GPIO.input(11) and not action_appuyer:
               data = {
                   "message": "APPUI", 
                   "type": "bouton_action",
                   "from": "back"
               }
               requests.post("http://"+host+":5000/api/send_message",json=data)
               action_appuyer = True
          elif not GPIO.input(11) and action_appuyer:
               data = {
                   "from": "back",
                   "message": "RELACHE",
                   "type": "bouton_action"
               }
               requests.post("http://"+host+":5000/api/send_message",json=data)
               
               action_appuyer = False





'''




if __name__ == '__main__':
    '''t1 = Thread(target=run_molette)
    t2 = Thread(target=run_bouttons)
    
    t1.start()
    t2.start()'''
 
    
    socketio.run(app, host=host, port=5000, debug=True, use_reloader=True, allow_unsafe_werkzeug=True)

    

   
