
import re
import sqlite3
from utils.CommandMaker import CommandMaker
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)

class Command(CommandMaker):
    
    def command(self):
        super().sayInstruction("Arrêt du chronomètre")
        requests.post(f"http://{super().get_config_value('URL')}:5000/api/stopwatch", json={"action": "stop"})
   
    def trigger(self, pText):
        return (re.search("arrêt", pText) or re.search("arrête", pText) or re.search("stop", pText)) and (re.search("chronomètre", pText) or re.search("chrono", pText) or re.search("chronometre", pText))
    def isSpecific(self):
        return False
    
