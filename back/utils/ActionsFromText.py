from utils.TextToSpeech import sayInstruction
import re
from commands.fiche import command as ficheCommand
from commands.reveil import command as reveilCommand
from commands.fiche import specificity as ficheSpecificity
from commands.reveil import specificity as reveilSpecificity
import os
import importlib


flag = False
action = ""
python_files = [f for f in os.listdir("./commands") if f.endswith('.py')]


def executeAction(pText):
    global flag
    global action
    if len(pText) == 0:
        return 
    print(f"Commande reçue: {pText}")

    if pText == "flo":
        sayInstruction("Oui?")
        flag = True
        return

    if flag:
        if action != "":
            addSpecificity(pText)
            return
        
        executeCommand(pText)
       


def executeCommand(pText):
    global flag
    global action
    for f in python_files:
        module = importlib.import_module(f"commands.{f[:-3]}")
        if hasattr(module, "trigger"):
            if module.trigger(pText):
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