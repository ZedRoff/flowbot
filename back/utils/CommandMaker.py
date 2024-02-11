from abc import ABC, abstractmethod
from utils.TextToSpeech import sayInstruction
import sqlite3
import random
from utils.ConvertStringToInt import convertStringToInt
import requests 
import json
db = sqlite3.connect("./db/database.db", check_same_thread=False)
from utils.ResetAction import resetAction
class CommandMaker(ABC):
    
    @abstractmethod
    def command(self):
        pass
    @staticmethod
    def specificity(self, param=None):
        pass
    @abstractmethod
    def trigger(self, pText):
        pass
    @abstractmethod
    def isSpecific(self):
        pass
    def sayInstruction(self, pText):
        sayInstruction(pText)
    def writeDb(self, pText):
        cur = db.cursor()
        cur.execute(pText)
        db.commit()
        cur.close()
    def resetAction(self):
        resetAction()
    def readDb(self, pText):
        cur = db.cursor()
        res = cur.execute(pText).fetchone()[0]
        db.commit()
        cur.close()
        return res
    def time_convert(self, sec):
        mins = sec // 60
        sec = sec % 60
        hours = mins // 60
        mins = mins % 60
        return "{0}:{1}:{2}".format(int(hours),int(mins),int(sec))
    def getRandomFromArray(array):
        return array[random.randint(0, len(array) - 1)]
    def convertStringToInt(self, pText):
        return convertStringToInt(pText)
    def emitMessage(self, message, type):
     
        requests.post(f"http://{self.get_config_value('URL')}:5000/api/emitMessage", json={"message": message, "command": type})
    def get_config_value(self,key):
        with open("../config.json") as f:
            config = json.load(f)
        return config.get(key)

