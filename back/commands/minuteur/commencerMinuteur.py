
import re
from tkinter import *
import datetime
import time
import threading 
from utils.CommandMaker import CommandMaker

minuteurList = []

convertStringToNum ={
    "zéro" : 0,
    "un" : 1,
    "une" : 1,
    "deux" : 2,
    "trois" : 3,
    "quatre" : 4,
    "cinq" : 5,
    "six" : 6,
    "sept" : 7,
    "huit" : 8,
    "neuf" : 9,
    "dix" : 10,
    "onze" : 11,
    "douze" : 12,
    "treize" : 13,
    "quatorze" : 14,
    "quinze" : 15,
    "seize" : 16,
    "dix-sept" : 17,
    "dix-huite" : 18,
    "dix-neuf" : 19,
    "vingt" : 20,
    "vingt et un" : 21,
    "vingt-deux" : 22,
    "vingt-trois" : 23,
    "vingt-quatre" : 24,
    "vingt-cinq" : 25,
    "vingt-six" : 26,
    "vingt-sept" : 27,
    "vingt-huit" : 28,
    "vingt-neuf" : 29,
    "trente" : 30,
    "trente et un" : 31,
    "trente-deux" : 32,
    "trente-trois" : 33,
    "trente-quatre" : 34,
    "trente-cinq" : 35,
    "trente-six" : 36,
    "trente-sept" : 37,
    "trente-huite" : 38,
    "trente-neuf" : 39,
    "quarante" : 40,
    "quarante et un" : 41,
    "quarante-deux" : 42,
    "quarante-trois" : 43,
    "quarante-quatre" : 44,
    "quarante-cinq" : 45,
    "quarante-six" : 46,
    "quarante-sept" : 47,
    "quarante-huite" : 48,
    "quarante-neuf" : 49,
    "cinquante" : 50,
    "cinquante et un" : 51,
    "cinquante-deux" : 52,
    "cinquante-trois" : 53,
    "cinquante-quatre" : 54,
    "cinquante-cinq" : 55,
    "cinquante-six" : 56,
    "cinquante-sept" : 57,
    "cinquante-huite" : 58,
    "cinquante-neuf" : 59,
    "soixante" : 60,
}

class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Bien sûr, dans combien de temps ?")

    def specificity(self,param):
        active = super().readDb("SELECT active FROM minuteur")
        if active == 1 :
            super().sayInstruction("Un minuteur est déjà en cours")
            return
        super().sayInstruction("Minuteur programmé pour dans " + param)
        super().writeDb("UPDATE minuteur SET active = 1")
        self.setUpAlarm(param)
        super().resetAction()


    def trigger(self,pText):
        return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("minuteur", pText)
    
    def setUpAlarm(self,timeInString):
        vStringSplited = [""]
        if(timeInString.__contains__("minutes")):
            vStringSplited = timeInString.split("minutes")
        elif(timeInString.__contains__("minute")):
            vStringSplited = timeInString.split("minute")
        else:
            return
        
        alarmTimerMinutes = convertStringToNum[vStringSplited[0].strip()]*60
        minuteurList.append(alarmTimerMinutes)
        self.alarm()

    def alarm(self):
        thread1 = threading.Thread(target=self.minuteurThread)
        thread1.start()


    def minuteurThread(self):
        while True :
                time.sleep(1)
                active = super().readDb("SELECT active FROM minuteur")
                if(active == 0 or len(minuteurList) == 0):
                    super().writeDb("UPDATE minuteur SET active = 0")
                    return
                for i in range(len(minuteurList)) :
                    minuteurList[i] -=1
                    if minuteurList[i] == 0 :
                        super().sayInstruction("AAAAAAA")
                        minuteurList.remove(i)
            
    def isSpecific(self):
        return True
