from utils.CommandMaker import CommandMaker

from deep_translator import GoogleTranslator

import re
from utils.ConvertLangToCode import convertLangToCode
step = "text"
text = ""
class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Bien sûr, quel texte dois-je traduire ?")
    
    def specificity(self, param):
        global step, text
        if step == "text":
            super().sayInstruction("Dans quelle langue ?")
            step = "lang"
            text = param
        elif step == "lang":
            if convertLangToCode(param) == None:
                super().sayInstruction("Langue non prise en charge")
            else:
                translated = GoogleTranslator(source='auto', target=convertLangToCode(param)).translate(text)
                super().sayInstruction(translated)
                super().resetAction()
                step = "text"
            

            
    def trigger(self, pText):
        return (re.search("fais", pText) or re.search("fait", pText) or re.search("réalise", pText)) and (re.search("traduction",pText)) or (re.search("traduit",pText))
    def isSpecific(self):
        return True
