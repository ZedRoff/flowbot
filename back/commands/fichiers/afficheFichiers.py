

from utils.CommandMaker import CommandMaker
import re

class Command(CommandMaker):
 
    def command(self):
        super().emitMessage("fichiers", "show_files")
    def trigger(self, pText):
        return (re.search("affiche", pText) or re.search("montre", pText)) and (re.search("fichiers", pText) or re.search("fichier", pText) or re.search("documents", pText))

    def isSpecific(self):
        return False