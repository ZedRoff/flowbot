from utils.TextToSpeech import sayInstruction
import os
import importlib
import sqlite3
import requests

flag = False
action = ""
perso_flag = False
python_files = {f[:-3] for f in os.listdir("./commands") if f.endswith('.py')}
modules = {}

def executeAction(pText):
    global flag, action, perso_flag
    if len(pText) == 0:
        return 
    print(f"Commande reçue: {pText}")

    if pText == "flo" and not flag and not perso_flag:
        requests.post("http://localhost:5000/api/emitMessage", json={"message": "listening"})
        sayInstruction("Oui, que puis-je faire pour vous ?")
        flag = True
        return

    if pText == "perso" and not flag and not perso_flag:
        requests.post("http://localhost:5000/api/emitMessage", json={"message": "listening"})
        sayInstruction("Vous pouvez utiliser vos commandes personnalisées")
        perso_flag = True 
        return

    if flag and not perso_flag:
        if action != "":
            addSpecificity(pText)
            return
        executeCommand(pText)

    if perso_flag and not flag and action == "":
        executeSimpleCommand(pText)


def executeSimpleCommand(pText):
    global perso_flag
    con = sqlite3.connect("./db/database.db")
    cur = con.cursor()
    cur.execute("SELECT reply FROM commandes WHERE name = ?", (pText,))
    reply = cur.fetchone()
    con.close()
    if reply is not None:
        sayInstruction(reply[0])
        perso_flag = False
    else:
        sayInstruction("Je n'ai pas compris votre demande")
      


def executeCommand(pText):
    global flag, action
    real_cmd = False
    for f in python_files:
        module = modules.get(f)
        if module is None:
            module = importlib.import_module(f"commands.{f}")
            modules[f] = module

        if hasattr(module, "trigger") and module.trigger(pText):
            real_cmd = True
            if hasattr(module, "command"):
                if hasattr(module, "specificity"):
                    module.command()
                    if hasattr(module, "specificityName"):
                        action = module.specificityName
                else:
                    requests.post("http://localhost:5000/api/emitMessage", json={"message": "notlistening"})
                    module.command()
                    action = ""
                    flag = False
            else:
                print("Commande mal formée dans le fichier " + f)
    if not real_cmd:
        sayInstruction("Je n'ai pas compris votre demande")
        action = ""

def addSpecificity(param):
    global action, flag
    for f in python_files:
        module = modules.get(f)
        if module is None:
            module = importlib.import_module(f"commands.{f}")
            modules[f] = module

        if hasattr(module, "specificity") and action == getattr(module, "specificityName", ""):
            module.specificity(param)
            action = ""
            flag = False
            requests.post("http://localhost:5000/api/emitMessage", json={"message": "notlistening"})
