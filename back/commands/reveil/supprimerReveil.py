
import re
import sqlite3
from utils.CommandMaker import CommandMaker


db = sqlite3.connect("./db/database.db", check_same_thread=False)

class Command(CommandMaker):
    
    def command(self):
        super().sayInstruction("A quel heure il se déclanche?")
    
    def specificity(self,timeInString):
        vStringSplited = timeInString.split("heures")
        alarmTimer = f"{super().convertStringToInt(vStringSplited[0].strip())}{super().convertStringToInt(vStringSplited[1].strip())}00"
        
        super().writeDb(f"UPDATE reveil SET active = 0 WHERE time ='{alarmTimer}'")
        super().resetAction()
        
    def trigger(self, pText):
        return (re.search("arrêt", pText) or re.search("arrête", pText) or re.search("stop", pText)) and re.search("réveil", pText)
    
    def isSpecific(self):
        return True
    