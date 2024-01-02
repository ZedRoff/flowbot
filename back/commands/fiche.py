from utils.TextToSpeech import sayInstruction
import re
def command():
    sayInstruction("Bien sûr, a quel nom ?")

def specificity(param):
    sayInstruction("Fiche créée avec le nom " + param)
def specificityName():
    return "fiche"
def trigger(pText):
    return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("fiche", pText)
    