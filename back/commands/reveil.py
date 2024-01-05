from utils.TextToSpeech import sayInstruction
from commands.rappel import getListRappel
import re
from tkinter import *
import datetime
import time

alarmList = [""]

def command():
    sayInstruction("Bien sûr, à quelle heure ?")

def specificity(param):
    sayInstruction("Réveil programmé à " + param)
    setUpAlarm(param)
def specificityName():
    return "réveil"
def trigger(pText):
    return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("réveil", pText)
    
def setUpAlarm(timeInString):
    print(timeInString)
    vStringSplited = timeInString.split("heure")
    alarmTimer = f"{vStringSplited[0].split()[-1]}:{vStringSplited[1].split()[0]}:{00}"
    alarmList.append(alarmTimer)
    alarm()

def alarm():
    while True :
        time.sleep(1)
        currentTime = datetime.datetime.now().strftime("%H:%M")
        for f in alarmList :
            if f == currentTime :
                if alarmList[0] == f:
                    sayInstruction("Bonjour, voici vos rappels")
                    for f in getListRappel():
                        sayInstruction(f)
                else :
                    sayInstruction("AAAAAAA")

def removeAlarm(pText):
    vStringSplited = pText.split("heure")
    alarmTimer = f"{vStringSplited[0].split()[-1]}:{vStringSplited[1].split()[0]}:{00}"
    alarmList.remove(alarmTimer)