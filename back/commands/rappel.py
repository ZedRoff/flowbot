from utils.TextToSpeech import sayInstruction
import re

rappelList = [""]

def command():
    sayInstruction("Bien sûr, que dois-je mettre dedans?")

def specificity(param):
    sayInstruction("Votre rappel a bien été créé")
    setUpRappel(param)

def specificityName():
    return "rappel"

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