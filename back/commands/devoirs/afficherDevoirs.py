

import re
from utils.CommandMaker import CommandMaker

class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, sur quel jour ?")
    def specificity(self, param):
            # vérifie si le jour est valide
            if (re.search("lundi", param) or re.search("mardi", param) or re.search("mercredi", param) or re.search("jeudi", param) or re.search("vendredi", param) or re.search("samedi", param) or re.search("dimanche", param)):
                # get all the homework for the day
                homework = super().readDb(f"SELECT {param} FROM devoirs")
                if homework == "":
                    super().sayInstruction(f"Il n'y a pas de devoirs pour le {param}")
                else:
                    super().sayInstruction(f"Les devoirs du {param} sont : {', '.join(homework.split('|'))}")
                    super().resetAction()
            else:
                super().sayInstruction("Ce jour n'est pas valide")
        
        
        
    def trigger(self, pText):
        return ((re.search("affiche",pText)) or (re.search("montre",pText))) and re.search("devoir", pText)
    def isSpecific(self):
        return True
