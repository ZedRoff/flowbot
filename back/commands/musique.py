from utils.TextToSpeech import sayInstruction
import re
import threading 
from tkinter import *
import pygame
from utils.ResetAction import resetAction
in_specificity = False

def command():
    sayInstruction("Bien sûr, quel musique voulez vous jouer?")

def specificity(param):
    global in_specificity
    thread = threading.Thread(target=playMusic, args=(param,))
    thread.start()
    resetAction()
    in_specificity = False



def trigger(pText):
    return ((re.search("joue",pText)) or (re.search("jou",pText) or (re.search("jous",pText))or (re.search("musique",pText)))) and re.search("chançon", pText)
def getInSpecificity():
    return in_specificity
def playMusic(param):
    pygame.mixer.init()
    pygame.mixer.music.load(r"D:/a/flowbot/flowbot/file/music/"+param.lower()+".mp3")
    pygame.mixer.music.play()
    print("ha")