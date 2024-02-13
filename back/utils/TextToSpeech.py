import pyttsx3
import requests
import json
import threading
import sqlite3
db = sqlite3.connect("./db/database.db", check_same_thread=False)

engine = pyttsx3.init()
voices = engine.getProperty('voices')

engine.setProperty('voice', voices[0].id)
 
engine.setProperty('rate', 150)  
engine.setProperty('volume', 0.8)  
def get_config_value(key):
    with open("../config.json") as f:
        config = json.load(f)
    return config.get(key)
def sayInstruction(textToSay):
    thread = threading.Thread(target=saySomeWordInThread, args=(textToSay,))
    thread.start()

def setSound(value):
    engine.setProperty('volume', value)


def saySomeWordInThread(string):
    try:
        #setSound(self.CommandMaker.currentVolGeneral)
        setVolumeMusic(-0.6)
        requests.post(f"http://{get_config_value('URL')}:5000/api/emitMessage", json={"message": string, "command": "command_usage"})

        engine.say(string)
        engine.startLoop(False)
        
        engine.iterate()
        setVolumeMusic(+0.6)
        engine.endLoop()   
    except RuntimeError:
        pass


def setVolumeMusic(vol):
    setVolumeMu(getCurrentVolumeMusic()+vol)

def setVolumeMu(pVol):
    writeDb(f"UPDATE son SET currentVolMusic = '{pVol}'")
def getCurrentVolumeMusic():
    return readDb("SELECT currentVolMusic FROM son")
def writeDb(pText):
    cur = db.cursor()
    cur.execute(pText)
    db.commit()
    cur.close()

def readDb(pText):
    cur = db.cursor()
    res = cur.execute(pText).fetchone()[0]
    db.commit()
    cur.close()
    return res