

import re
from utils.CommandMaker import CommandMaker

class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, a quel nom ?")
    def specificity(self, param):
        super().sayInstruction("Fiche créée avec le nom " + param)
        super().resetAction()
    def trigger(self, pText):
        return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("fiche", pText)
    def isSpecific(self):
        return True
