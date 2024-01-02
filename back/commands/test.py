from utils.TextToSpeech import sayInstruction

def command():
    sayInstruction("Test OK, quel message a faire transiter ?")

def specificity(param):
    print(param + " a été transmis")
def trigger(pText):
    return pText == "test"