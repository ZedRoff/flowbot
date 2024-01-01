import pyttsx3
engine = pyttsx3.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)

def sayInstruction(textToSay):
    try:
        engine.say(textToSay)
        engine.startLoop(False)
        engine.iterate()
        engine.endLoop()
       
    except RuntimeError:
        pass
       


