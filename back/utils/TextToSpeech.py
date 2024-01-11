import pyttsx3
import requests
import json
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
    try:
        requests.post(f"http://{get_config_value('URL')}:5000/api/emitMessage", json={"message": textToSay})

        engine.say(textToSay)
        engine.startLoop(False)
        engine.iterate()
        engine.endLoop()
       
    except RuntimeError:
        pass
