import pyttsx3
import requests
import json
import threading 


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


def saySomeWordInThread(string):
    try:
        requests.post(f"http://{get_config_value('URL')}:5000/api/emitMessage", json={"message": string})

        engine.say(string)
        engine.startLoop(False)
        engine.iterate()
        engine.endLoop()   
    except RuntimeError:
        pass