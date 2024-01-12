from utils.TextToSpeech import sayInstruction
from utils.ResetAction import resetAction

def command():
    sayInstruction("Quel est ton nom ?")

name = ""
age = 0
step = "name"
in_specificity = False



def specificity(param): 
    global step, name, age, in_specificity
    if step == "name":
        name = param
        sayInstruction("Ok, quel est ton age ?")
        step = "age"
    elif step == "age":
        age = param
        sayInstruction("Ok, tu t'appelles "+name+" et tu as "+age+" ans")
        resetAction()
        step = "name"
        in_specificity = False

def getInSpecificity():
    return in_specificity

def trigger(pText):
    return pText == "test"