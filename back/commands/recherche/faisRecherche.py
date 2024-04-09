from utils.CommandMaker import CommandMaker
from googlesearch import search




import re

step = "prompt"
class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, quelle recherche dois-je faire ?")
    
    def specificity(self, param):
        global step
        if step == "prompt":
            res_temp = search(param, advanced=True)
            print(res_temp)
            res = list(map(lambda x: x, res_temp))[0]
            super().sayInstruction(res.description)
            super().resetAction()
            step = "prompt"
        pass
    def trigger(self, pText):
        return (re.search("fais", pText) or re.search("fait", pText) or re.search("réalise", pText)) and (re.search("recherche",pText)) or (re.search("cherche",pText))
    def isSpecific(self):
        return True
