from utils.TextToSpeech import sayInstruction
import re
from utils.ResetAction import resetAction
in_specificity = False

rappelList = [""]

def command():
    sayInstruction("Bien sûr, que dois-je mettre dedans?")

def specificity(param):
    sayInstruction("Votre rappel a bien été créé")
    setUpRappel(param)
    resetAction()
    in_specificity = False
    

def getInSpecificity():
    return in_specificity

def trigger(pText):
    return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("rappel", pText)
    
def setUpRappel(textRappel):
    rappelList.append(textRappel)

def getListRappel():
    return rappelList

def changerRappels(pText):
    rappelList[0] = pText

def deletRappel(pText):
    rappelList.remove(pText)