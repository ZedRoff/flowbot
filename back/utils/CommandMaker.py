from abc import ABC, abstractmethod
from utils.TextToSpeech import sayInstruction
import sqlite3
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
    

