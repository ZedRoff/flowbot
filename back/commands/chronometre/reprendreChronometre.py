
import re

from utils.CommandMaker import CommandMaker
import requests
class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Reprise du chronomètre")
        requests.post(f"http://{super().get_config_value('URL')}:5000/api/stopwatch", json={"action": "resume"})
    def trigger(self, pText):
        return (re.search("reprendre", pText) or re.search("reprend", pText) or re.search("continue", pText)) and (re.search("chronomètre", pText) or re.search("chrono", pText) or re.search("chronometre", pText))
    def isSpecific(self):
        return False