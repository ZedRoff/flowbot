
from utils.TextToSpeech import sayInstruction
import re
flag = False
action = ""
def executeAction(pText):
    global flag
    global action
    if len(pText) == 0: return # si la chaine est vide, on ne fait rien
    print(f"Commande reçue: {pText}")
    if pText == "flo":
        sayInstruction("Oui?")
        flag = True
        return
    if flag:

        if action != "" :
            addSpecificity(pText)
            return
        
        if pText == "test":
            sayInstruction("Test OK")
            flag = False
            return 
        elif (re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText)) or (re.search("créé",pText))):
            if re.search("fiche",pText) :
                sayInstruction("Biensûr, quel nom?")
                action = "fiche"
            elif re.search("réveil",pText) :
                sayInstruction("Biensûr, à quel heure")
                action = "réveil"
            else :
                action = ""
        else :
            sayInstruction("Je n'ai pas compris, veuillez répéter")
            action = ""
            

        

    

def addSpecificity(param) :
    global action 
    global flag
    if action == "réveil" :
        print("Réveil créer a " + param)
    if action == "fiche" :
        print("Fiche créer a " + param)    
    flag = False
    action = ""

