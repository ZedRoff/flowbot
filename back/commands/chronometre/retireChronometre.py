
import re
import sqlite3
from utils.CommandMaker import CommandMaker
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)

class Command(CommandMaker):
    
    def command(self):
        super().sayInstruction("Chronomètre retiré de l'écran mais toujours actif")
        super().emitMessage("chronometre", "hide_stopwatch")
    def trigger(self, pText):
        return (re.search("retire", pText) or re.search("cache", pText) or re.search("enlève", pText)  ) and (re.search("chronomètre", pText) or re.search("chrono", pText) or re.search("chronometre", pText))
    def isSpecific(self):
        return False
    
