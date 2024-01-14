
import re
from utils.CommandMaker import CommandMaker



class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, que dois-je mettre dedans?")
    def specificity(self, param):
        last_rappels = super().readDb("SELECT * FROM rappels")
        last_rappels = last_rappels.split("|")
        last_rappels.append(param)
        last_rappels = "|".join(last_rappels)
        super().writeDb("UPDATE rappels SET liste = '"+last_rappels+"'")
        super().sayInstruction("Votre rappel a bien été créé")
       
        super().resetAction()
    def trigger(self, pText):
        return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("rappel", pText)
    
    def isSpecific(self):
        return True