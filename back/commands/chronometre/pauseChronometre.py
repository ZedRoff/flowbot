
import re
import requests
from utils.CommandMaker import CommandMaker



class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Chronomètre mit en pause")
        requests.post(f"http://{super().get_config_value('URL')}:5000/api/stopwatch", json={"action": "pause"})
    
    def trigger(self, pText):
        return (re.search("pose", pText) or re.search("pause", pText)) and (re.search("chronomètre", pText) or re.search("chrono", pText) or re.search("chronometre", pText))
    def isSpecific(self):
        return False