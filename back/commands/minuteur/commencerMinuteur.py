
import re
from tkinter import *
import datetime
import time
import threading 
from utils.CommandMaker import CommandMaker

minuteurList = {}



class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Bien sûr, dans combien de temps ?")

    def specificity(self,param):
        self.setUpAlarm(param)
        super().resetAction()


    def trigger(self,pText):
        return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("minuteur", pText)
    
    def convertToMin(self,string):
        vStringSplited = [""]
        if(string.__contains__("minutes")):
            vStringSplited = string.split("minutes")
        elif(string.__contains__("minute")):
            vStringSplited = string.split("minute")
        else:
            return 0
        
        return super().convertStringToInt(vStringSplited[0].strip())*60

    def setUpAlarm(self,timeInString):
        
        alarmTimerMinutes = self.convertToMin(timeInString)

        minuteurList[f"{alarmTimerMinutes}"]=alarmTimerMinutes

        super().writeDb(f"INSERT OR IGNORE INTO minuteur VALUES ({alarmTimerMinutes},{0})")

        active = super().readDb(f"SELECT active FROM minuteur WHERE min = '{alarmTimerMinutes}'")
        if active == 1:
            super().sayInstruction("Un minuteur est déjà en cours")
            return
        super().sayInstruction("Minuteur programmé pour dans " + timeInString)
        super().writeDb(f"UPDATE minuteur SET active = 1 WHERE min ='{alarmTimerMinutes}'")

        
        self.alarm(f"{alarmTimerMinutes}")

    def alarm(self,index):
        thread1 = threading.Thread(target=self.minuteurThread,args=(index,))
        thread1.start()


    def minuteurThread(self,i):
        while True :
                time.sleep(1)
                minuteurList[i] -=1
                print(minuteurList[i])
                if minuteurList[i] == 0 :
                    super().sayInstruction("AAAAAAA")
                    super().writeDb(f"UPDATE minuteur SET active = 0 WHERE min ='{i}'")
                    minuteurList.pop(i)
                    return
                active = super().readDb(f"SELECT active FROM minuteur WHERE min ='{i}'")
                if(active == 0 or len(minuteurList) == 0):
                    super().writeDb(f"UPDATE minuteur SET active = 0 WHERE min ='{i}'")
                    minuteurList.pop(i)
                    return
                       
            
    def isSpecific(self):
        return True

    