from utils.TextToSpeech import sayInstruction
from commands.rappel import getListRappel
import re
from tkinter import *
import datetime
import time

alarmList = [""]

convertStringToNum ={
    "zéro" : 00,
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
    "vingt-quarte" : 24,
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
    alarmTimer = f"{convertStringToNum[vStringSplited[0].strip()]}:{convertStringToNum[vStringSplited[1].strip()]}:{00}"
    alarmList.append(alarmTimer)
    print(alarmTimer)
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
    alarmTimer = f"{convertStringToNum[vStringSplited[0].split()[-1]]}:{convertStringToNum[vStringSplited[1].split()[0]]}:{00}"
    alarmList.remove(alarmTimer)