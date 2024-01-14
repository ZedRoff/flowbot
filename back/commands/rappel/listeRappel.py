
import re
from utils.CommandMaker import CommandMaker



class Command(CommandMaker):
    def command(self):
        rappels = super().readDb("SELECT * FROM rappels")
        rappels = rappels.split("|")
        rappels = ", ".join(rappels)
        super().sayInstruction(f"Voici vos rappels : {rappels}")
       
    def trigger(self, pText):
        return ((re.search("affiche",pText)) or (re.search("donne",pText) or (re.search("montre",pText))or (re.search("voir",pText)))) and (re.search("rappel", pText) or re.search("rappels", pText))
    
    def isSpecific(self):
        return False