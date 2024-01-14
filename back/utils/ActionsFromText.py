from utils.TextToSpeech import sayInstruction
import os
import importlib
import sqlite3

is_global_action = False
db_connection = sqlite3.connect("./db/database.db", check_same_thread=False)
is_personal_action = False
python_files = []

# Get all python files in the "commands" directory
for root, dirs, files in os.walk("./commands"):
    for file in files:
        if file.endswith(".py"):
            python_files.append(f"{root[11:len(root)]}.{file[0:-3]}")

modules = {}

# Import modules and instantiate commands
for file_path in python_files:
    module = modules.get(file_path)
    if module is None:
        module = importlib.import_module(f"commands.{file_path}")
        modules[file_path] = module.Command()
        print(f"Imported module: {file_path}")


def execute_action(text):
    global is_global_action, is_personal_action

    if len(text) == 0:
        return

    print(f"Received command: {text}")

    cursor = db_connection.cursor()
    global_action = cursor.execute("SELECT action FROM global").fetchone()[0]
    cursor.close()

    if global_action != "":
        add_specificity(text)
        return

    if text == "flo" and not is_global_action and not is_personal_action:
        sayInstruction("Oui, que puis-je faire pour vous ?")
        is_global_action = True
        return
    if (text == "stop" or text == "rien" or text == "ryan") and is_global_action and not is_personal_action:
        sayInstruction("A bientôt !")
        is_global_action = False
        return
    

    if text == "perso" and not is_global_action and not is_personal_action:
        sayInstruction("Vous pouvez utiliser vos commandes personnalisées")
        is_personal_action = True
        return

    if is_global_action and not is_personal_action:
        execute_command(text)

    if is_personal_action and not is_global_action and global_action == "":
        execute_simple_command(text)


def execute_simple_command(text):
    global is_personal_action

    cursor = db_connection.cursor()
    cursor.execute("SELECT reply FROM commandes WHERE name = ?", (text,))
    reply = cursor.fetchone()
    cursor.close()

    if reply is not None:
        sayInstruction(reply[0])
        is_personal_action = False
    else:
        sayInstruction("Je n'ai pas compris votre demande")


def execute_command(text):
    global is_global_action

    is_real_command = False

    for file_path in python_files:
        module = modules.get(file_path)

        if module.trigger(text):
            is_real_command = True

            if module.isSpecific():
                module.command()
                db_connection.execute("UPDATE global SET action = ?", (file_path[:-3],))
                db_connection.commit()
            else:
                module.command()

            is_global_action = False

    if not is_real_command:
        sayInstruction("Je n'ai pas compris votre demande")


def add_specificity(param):
    global is_global_action

    global_action = db_connection.execute("SELECT action FROM global").fetchone()[0]

    for file_path in python_files:
        module = modules.get(file_path)

        if global_action == file_path[:-3]:
            module.specificity(param)
            return
