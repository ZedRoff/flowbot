from utils.TextToSpeech import sayInstruction
import re
def command():
    sayInstruction("Bien sûr, à quelle heure ?")

def specificity(param):
    sayInstruction("Réveil programmé à " + param)

def trigger(pText):
    return re.search("réveil",pText)