import pyttsx3
from utils.EmitMessage import emit_message

engine = pyttsx3.init()
voices = engine.getProperty('voices')

engine.setProperty('voice', voices[0].id)

engine.setProperty('rate', 150)  
engine.setProperty('volume', 0.8)  

def sayInstruction(textToSay):
    try:
        engine.say(textToSay)
        engine.startLoop(False)
        engine.iterate()
        engine.endLoop()
       
    except RuntimeError:
        pass
