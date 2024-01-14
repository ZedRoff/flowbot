
from commands.rappel.creerRappel import Command
import re
from tkinter import *
import datetime
import time
import threading 
from utils.CommandMaker import CommandMaker

alarmList = [""]


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
        alarmTimer = f"{super().convertStringToInt(vStringSplited[0].strip())}{super().convertStringToInt(vStringSplited[1].strip())}00"

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