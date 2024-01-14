
import re
import sqlite3
from utils.CommandMaker import CommandMaker

db = sqlite3.connect("./db/database.db", check_same_thread=False)

class Command(CommandMaker):
    
    def command(self):
        super().sayInstruction("Arrêt du minuteur")
        super().writeDb(f"UPDATE minuteur SET active = {0}")
    def trigger(self, pText):
        return (re.search("arrêt", pText) or re.search("arrête", pText) or re.search("stop", pText)) and re.search("minuteur", pText)
    def isSpecific(self):
        return False
    
