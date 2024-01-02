from utils.TextToSpeech import sayInstruction
import re
def command():
    sayInstruction("Bien sûr, a quel nom ?")

def specificity(param):
    sayInstruction("Fiche créée avec le nom " + param)

def trigger(pText):
    return re.search("fiche",pText)
    