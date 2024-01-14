
import re
import sqlite3
from utils.CommandMaker import CommandMaker


db = sqlite3.connect("./db/database.db", check_same_thread=False)

class Command(CommandMaker):
    
    def command(self):
        super().sayInstruction("Quel était le temps du minuteur?")
    
    def specificity(self,timeInString):
        temp = self.convertToMin(timeInString)
        super().writeDb(f"UPDATE minuteur SET active = 0 WHERE min ='{temp}'")
        super().resetAction()
        
    def trigger(self, pText):
        return (re.search("arrêt", pText) or re.search("arrête", pText) or re.search("stop", pText)) and re.search("minuteur", pText)
    
    def isSpecific(self):
        return True
    
    def convertToMin(self,string):
        vStringSplited = [""]
        if(string.__contains__("minutes")):
            vStringSplited = string.split("minutes")
        elif(string.__contains__("minute")):
            vStringSplited = string.split("minute")
        else:
            return 0
        
        return super().convertStringToInt(vStringSplited[0].strip())*60
