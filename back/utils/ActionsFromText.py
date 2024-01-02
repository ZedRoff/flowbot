import re
from utils.TextToSpeech import sayInstruction

action = ""

def executeAction( pText):
    vText = pText.lower()
    if action != "" :
        addSpecificity(action,pText)
        return
    
    if (re.search("fais",vText)) or (re.search("fait",vText)or (re.search("créer",vText))or (re.search("créé",vText))):
        if re.search("fiche",vText) :
            sayInstruction("Biensûr, quel nom?")
            action = "fiche"
        elif re.search("réveil",vText) :
            sayInstruction("Biensûr, à quel heure")
            action = "réveil"
        else :
            action = ""
    else :
        action = ""


def addSpecificity(type,param) :
    if action == "réveil" :
        print("Réveil créer a " + param)
    elif action == "fiche" :
       print("Fiche créer a " + param) 