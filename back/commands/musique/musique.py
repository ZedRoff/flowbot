import re
import threading 
import time
from tkinter import *
from pygame import mixer
from utils.CommandMaker import CommandMaker

def setVolume(volume):
    mixer.music.set_volume(volume)

class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, quel musique voulez vous jouer?")

    def specificity(self, param):
        active = super().readDb("SELECT active FROM musiques")
        if active == 1 or active == 2:
            super().sayInstruction("Une musique est déjà en cours")
            super().resetAction()
            return
        super().writeDb("UPDATE musiques SET active = 1")
        thread = threading.Thread(target=self.playMusic, args=(param,))
        thread.start()
        super().resetAction()



    def trigger(self, pText):
        return (((re.search("joue",pText)) or (re.search("jou",pText)) or (re.search("jous",pText))or (re.search("jouer",pText))) and ((re.search("musique",pText)) or re.search("chançon", pText)))
    
    def playMusic(self, param):
        mixer.init()
        mixer.music.load(r"D:/a/flowbot/flowbot/file/music/"+param.lower()+".mp3")
        mixer.music.play()
        while True:
            time.sleep(0.1)
            setVolume(super().getCurrentVolumeMusic())
            active = super().readDb("SELECT active FROM musiques")
            
            if active == 1 and not mixer.music.get_busy():
                mixer.music.play()
            elif active == 2 :
                self.pauseMusic()
            elif active == 3 :
                self.resumeMusic()
                super().writeDb("UPDATE musiques SET active = 1")
            elif active == 0 :
                self.stopMusic()
                return

    def stopMusic(self):
        mixer.music.stop()

    def pauseMusic(self):
        mixer.music.pause()

    def resumeMusic(self):
        mixer.music.unpause()
    def isSpecific(self):
        return True