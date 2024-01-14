
from commands.rappel.creerRappel import Command
import re
from tkinter import *
import datetime
import time
import threading 
from utils.CommandMaker import CommandMaker


alarmList = [""]
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
        super().sayInstruction("Bien sûr, à quelle heure ?")

    def specificity(self, param):
        self.setUpAlarm(param)
        super().resetAction()

    def trigger(self, pText):
        return ((re.search("fais",pText)) or (re.search("fait",pText)) or (re.search("créer",pText))or (re.search("créé",pText))) and re.search("réveil", pText)
    
    def setUpAlarm(self, timeInString):
        if(not timeInString.__contains__("heures")):
            return
        
        vStringSplited = timeInString.split("heures")
        alarmTimer = f"{convertStringToNum[vStringSplited[0].strip()]}{convertStringToNum[vStringSplited[1].strip()]}00"

        super().writeDb(f"INSERT OR IGNORE INTO reveil VALUES ({alarmTimer},{0})")

        active = super().readDb(f"SELECT active FROM reveil WHERE time ='{alarmTimer}'")
        if active == 1:
            super().sayInstruction("Un reveil est déjà en cours")
            return
        super().sayInstruction("Réveil programmé à " + timeInString)
        super().writeDb(f"UPDATE reveil SET active = 1 WHERE time ='{alarmTimer}'")

        alarmList.append(alarmTimer)
        
        self.alarm(alarmTimer)

    def alarm(self,index):
        thread1 = threading.Thread(target=self.alarmThread,args=(index,))
        thread1.start()

    def alarmThread(self,index):
        while True :
            time.sleep(1)
            currentTime = datetime.datetime.now().strftime("%H%M%S")
            if index == currentTime :
                if alarmList[0] == index:
                    super().sayInstruction("Bonjour, voici vos rappels")
                    time.sleep(3)
                    for f in Command().getRappelList():
                        super().sayInstruction(f)
                else :
                    super().sayInstruction("AAAAAAA")

            active = super().readDb(f"SELECT active FROM reveil WHERE time = '{index}'")
            if(active == 0 or len(alarmList) == 0):
                super().writeDb(f"UPDATE reveil SET active = 0 WHERE time ='{index}'")
                alarmList.remove(index)
                return
            

    def isSpecific(self):
        return True