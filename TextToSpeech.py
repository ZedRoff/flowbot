import pyttsx3
engine = pyttsx3.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)#Ici on prend la voix

def sayInstruction(textToSay):
    engine.say(textToSay)#Ici on prend le text
    engine.runAndWait()

file = open("Test.txt", "r")
content = file.read()
sayInstruction(content) #Il y a un tuto pour customiser la voix
