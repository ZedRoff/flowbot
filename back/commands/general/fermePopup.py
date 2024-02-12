

from utils.CommandMaker import CommandMaker
import re

class Command(CommandMaker):
 
    def command(self):
        super().emitMessage("fichiers", "hide_files")
    def trigger(self, pText):
        return (re.search("ferme", pText) or re.search("retire", pText) or re.search("enlève", pText)) and (re.search("fenêtre", pText) or re.search("popup", pText) or re.search("pop-up", pText))

    def isSpecific(self):
        return False