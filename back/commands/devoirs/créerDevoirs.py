

import re
from utils.CommandMaker import CommandMaker
step = "day"
day = ""
class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, sur quel jour ?")
    def specificity(self, param):
        global step, day
        if step == "day":
            if (re.search("lundi", param) or re.search("mardi", param) or re.search("mercredi", param) or re.search("jeudi", param) or re.search("vendredi", param) or re.search("samedi", param) or re.search("dimanche", param)):
                day = param
                super().sayInstruction("L'intitulé du devoir ?")
                step = "description"
            else:
                super().sayInstruction("Ce jour n'est pas valide")
        elif step == "description":
            # get the previous homework 
            homework = super().readDb("SELECT "+day+" FROM devoirs")
            print(homework)
            if homework == "":
                homework = param
            else:
                homework = homework + "|" + param
            super().writeDb(f"UPDATE devoirs SET {day} = '{homework}'")
            super().sayInstruction("Devoirs ajouté")
            super().resetAction()
            step = "day"
        
        
    def trigger(self, pText):
        return ((re.search("fais",pText)) or (re.search("ajoute",pText)) or (re.search("planifie",pText)) or (re.search("créer",pText) or (re.search("crée",pText))or (re.search("fait",pText)))) and re.search("devoir", pText)
    def isSpecific(self):
        return True
