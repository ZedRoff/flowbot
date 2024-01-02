from utils.TextToSpeech import sayInstruction

def command():
    sayInstruction("Bonjour, comment se passe votre journée ?")

def specificity(param):
    None
    
def trigger(pText):
    return pText == "bonjour"