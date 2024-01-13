from utils.TextToSpeech import sayInstruction
from utils.ResetAction import resetAction
import re
in_specificity = False

def command():
    sayInstruction("Bien sûr, a quel nom ?")

def specificity(param):
    global in_specificity
    sayInstruction("Fiche créée avec le nom " + param)
    resetAction()
    in_specificity = False

    
def getInSpecificity():
    return in_specificity

def trigger(pText):
    return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("fiche", pText)
    