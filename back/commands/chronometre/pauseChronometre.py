
import re

from utils.CommandMaker import CommandMaker



class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Chronomètre mit en pause")
        super().writeDb("UPDATE chronometre SET active = 2")
    
    def trigger(self, pText):
        return (re.search("pose", pText) or re.search("pause", pText)) and re.search("chronomètre", pText)
    def isSpecific(self):
        return False