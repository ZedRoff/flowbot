from utils.TextToSpeech import sayInstruction
import re
def command():
    sayInstruction("Bien sûr, à quelle heure ?")

def specificity(param):
    sayInstruction("Réveil programmé à " + param)
def specificityName():
    return "réveil"
def trigger(pText):
    return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("réveil", pText)
    