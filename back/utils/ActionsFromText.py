from utils.TextToSpeech import sayInstruction
import os
import importlib
import sqlite3


flag = False
action = ""
perso_cmd = False
python_files = [f for f in os.listdir("./commands") if f.endswith('.py')]


def executeAction(pText):
    global flag
    global action
    global perso_cmd
    if len(pText) == 0:
        return 
    print(f"Commande reçue: {pText}")

    if pText == "flo" and not flag and not perso_cmd:
        sayInstruction("Oui, que puis-je faire pour vous ?")
        flag = True
        return
    if pText == "perso" and not flag and not perso_cmd:
        sayInstruction("Vous pouvez utiliser vos commandes personnalisées")
        perso_cmd = True 
        return
    if flag and not perso_cmd:
        if action != "":
            addSpecificity(pText)
            return
        executeCommand(pText)
    if perso_cmd and not flag and action == "":
        executeSimpleCommand(pText)
        perso_cmd = False
    
        
       
       
def executeSimpleCommand(pText):
  
    con = sqlite3.connect("./db/database.db")
    cur = con.cursor()
    cur.execute("SELECT reply FROM commandes WHERE name = ?", (pText,))
    reply = cur.fetchone()
    con.close()
    if reply is not None:
    
        sayInstruction(reply[0])
   

def executeCommand(pText):
    global flag
    global action
    real_cmd = False
    for f in python_files:
        module = importlib.import_module(f"commands.{f[:-3]}")
        
        if hasattr(module, "trigger"):
            if module.trigger(pText):
                
                real_cmd = True
                if hasattr(module, "command") and hasattr(module, "specificity"):
                    module.command()
                    
                    if hasattr(module, "specificityName"):
                        action = module.specificityName
                elif hasattr(module, "command"):
                    module.command()
                    action = ""
                    flag = False 
                else:
                    print("Commande mal formée dans le fichier " + f)
    if not real_cmd:
        sayInstruction("Je n'ai pas compris votre demande")
        action = ""
        return
            
               


def addSpecificity(param):
    global action 
    global flag
    for f in python_files:
        module = importlib.import_module(f"commands.{f[:-3]}")
        if hasattr(module, "specificity"):
            if hasattr(module, "specificityName"):
                if action == module.specificityName:
                    module.specificity(param)
                    action = ""
                    flag = False
