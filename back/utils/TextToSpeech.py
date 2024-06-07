import asyncio
import edge_tts
import vlc
import requests
import json
import threading
import sqlite3


db = sqlite3.connect("./db/database.db", check_same_thread=False)

VOICES = [ 'fr-FR-DeniseNeural','fr-FR-RemyMultilingualNeural','fr-FR-HenriNeural']
VOICE = VOICES[2]


def get_config_value(key):
    with open("../config.json") as f:
        config = json.load(f)
    return config.get(key)


async def amain(textToSpeak):
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save("temp.mp3")
    


def sayInstruction(textToSay):
    thread = threading.Thread(target=saySomeWordInThread, args=(textToSay,))
    thread.start()

def setSound(value):
    engine.setProperty('volume', value)


def saySomeWordInThread(string):
    try:
        #setSound(self.CommandMaker.currentVolGeneral)
        loop = asyncio.get_event_loop_policy().get_event_loop()
        try:
            loop.run_until_complete(amain(textToSpeak))
        finally:
            loop.close()
            
        p = vlc.MediaPlayer("temp.mp3")
        p.play()
        setVolumeMusic(-0.6)
        requests.post(f"http://{get_config_value('URL')}:5000/api/emitMessage", json={"message": string, "command": "command_usage"})

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