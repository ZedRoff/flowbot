

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
                devoirs_temp = super().readDb("SELECT "+day+" FROM devoirs")
                devoirs = ""
                for i in range(len(devoirs_temp.split("|"))):
                    devoirs += f"{i+1} : {devoirs_temp.split('|')[i]}"
                super().sayInstruction("Donnez l'indice du devoir à supprimer, voici les correspondances : {devoirs}")
                step = "devoir"
            else:
                super().sayInstruction("Ce jour n'est pas valide")
        elif step == "devoir":
            # get the previous homework 
            homework = super().readDb("SELECT "+day+" FROM devoirs")
            # get the length of the homework
            length = len(homework.split("|"))
            if (int(param) > length) or (int(param) < 1):
                super().sayInstruction("Cet indice n'est pas valide")
            else:
                # remove the homework
                homework = homework.split("|")
                homework.pop(int(param)-1)
                homework = "|".join(homework)
                super().writeDb(f"UPDATE devoirs SET {day} = '{homework}'")
                super().sayInstruction("Devoir supprimé")
                super().resetAction()
                step = "day"
        
        
    def trigger(self, pText):
        return (re.search("supprime",pText)) or (re.search("enlève",pText)) or (re.search("supprimer",pText))  and re.search("devoir", pText)
    def isSpecific(self):
        return True
