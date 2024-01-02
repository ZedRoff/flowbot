from utils.TextToSpeech import sayInstruction

def command():
    sayInstruction("Bonjour, comment se passe votre journée ?")


def trigger(pText):
    return pText == "bonjour"