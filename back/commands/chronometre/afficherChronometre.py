
import re
import sqlite3
from utils.CommandMaker import CommandMaker
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)

class Command(CommandMaker):
    
    def command(self):
        super().sayInstruction("Chronomètre affiché")
        super().emitMessage("chronometre", "show_stopwatch")
    def trigger(self, pText):
        return (re.search("afficher", pText) or re.search("affiche", pText) or re.search("montre", pText)) and (re.search("chronomètre", pText) or re.search("chrono", pText) or re.search("chronometre", pText))
    def isSpecific(self):
        return False
    
