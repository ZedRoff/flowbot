
import re

from utils.CommandMaker import CommandMaker

class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Reprise de la musique")
        super().writeDb("UPDATE musiques SET active = 3")
    def trigger(self, pText):
        return (re.search("reprendre", pText) or re.search("reprend", pText) or re.search("continue", pText)) and re.search("musique", pText)
    def isSpecific(self):
        return False