from utils.TextToSpeech import sayInstruction
import os
import importlib
import sqlite3
flag = False
db = sqlite3.connect("./db/database.db")
cur = db.cursor()




perso_flag = False
python_files = []
for root, dirs, files in os.walk("./commands"):
    for file in files:
        if file.endswith(".py"):
            python_files.append(f"{root[11:len(root)]}.{file[0:-3]}")
print(python_files)
modules = {}



def executeAction(pText):
    global flag,  perso_flag
    if len(pText) == 0:
        return 
    
    print(f"Commande reçue: {pText}")
    action = cur.execute("SELECT action FROM global").fetchone()[0]
      
    if action != "":
        addSpecificity(pText)
        return
    if pText == "flo" and not flag and not perso_flag:
        sayInstruction("Oui, que puis-je faire pour vous ?")
        flag = True
        return

    if pText == "perso" and not flag and not perso_flag:
        sayInstruction("Vous pouvez utiliser vos commandes personnalisées")
        perso_flag = True 
        return
      
    
    if flag and not perso_flag:  
        executeCommand(pText)

    if perso_flag and not flag and action == "":
        executeSimpleCommand(pText)


def executeSimpleCommand(pText):
    global perso_flag
   
    cur.execute("SELECT reply FROM commandes WHERE name = ?", (pText,))
    reply = cur.fetchone()
  
    if reply is not None:
        sayInstruction(reply[0])
        perso_flag = False
    else:
        sayInstruction("Je n'ai pas compris votre demande")
      


def executeCommand(pText):
    global flag
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
                    db.execute("UPDATE global SET action = ?", (f[:-3],))
                    db.commit()
                else:
                    module.command()
                    cur.execute("UPDATE global SET action = ?", ("",))
                    db.commit()
                    flag = False
            else:
                print("Commande mal formée dans le fichier " + f)
    if not real_cmd:
        sayInstruction("Je n'ai pas compris votre demande")
        cur.execute("UPDATE global SET action = ?", ("",))
        db.commit()


def addSpecificity(param):
    global flag
    action = db.execute("SELECT action FROM global").fetchone()[0]
    
    for f in python_files:
        module = modules.get(f)
        if module is None:
            module = importlib.import_module(f"commands.{f}")
            modules[f] = module
        if hasattr(module, "specificity") and action == f[:-3] and hasattr(module, "getInSpecificity"):
            module.specificity(param)
            flag = module.getInSpecificity()
            return
