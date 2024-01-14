
import re

from utils.CommandMaker import CommandMaker

class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Reprise du chronomètre")
        super().writeDb("UPDATE chronometre SET active = 1")
    def trigger(self, pText):
        return (re.search("reprendre", pText) or re.search("reprend", pText) or re.search("continue", pText)) and re.search("chronomètre", pText)
    def isSpecific(self):
        return False