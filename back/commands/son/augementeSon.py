import re
from utils.CommandMaker import CommandMaker

class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr")
        super().setVolumeGlobal(0.1)
 
    def trigger(self, pText):
        return (((re.search("augemente",pText)) or (re.search("augementes",pText))) and ((re.search("son",pText)) or re.search("sont", pText))or re.search("sons", pText))
    
   

    def isSpecific(self):
        return False