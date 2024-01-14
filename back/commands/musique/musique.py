
import re
import threading 
from tkinter import *
import pygame
from utils.CommandMaker import CommandMaker

class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, quel musique voulez vous jouer?")
    def specificity(self, param):
        thread = threading.Thread(target=self.playMusic, args=(param,))
        thread.start()
        super().resetAction()
    def trigger(self, pText):
        return ((re.search("joue",pText)) or (re.search("jou",pText) or (re.search("jous",pText))or (re.search("musique",pText)))) and re.search("chançon", pText)
    def playMusic(self, param):
        pygame.mixer.init()
        pygame.mixer.music.load(r"D:/a/flowbot/flowbot/file/music/"+param.lower()+".mp3")
        pygame.mixer.music.play()
        print("ha")
    def isSpecific(self):
        return True