from utils.TextToSpeech import sayInstruction
import re

def command():
    sayInstruction("Bien sûr, quel musique voulez vous jouer?")

def specificity(param):
    playMusic(param)

def specificityName():
    return "musique"
def trigger(pText):
    return ((re.search("joue",pText)) or (re.search("jou",pText) or (re.search("jous",pText))or (re.search("musique",pText)))) and re.search("chançon", pText)

def playMusic(param):
    print(param)