import os
import importlib

def exec():
    python_files = [f for f in os.listdir("./commands") if f.endswith('.py')]
    print(python_files)
    sentence = "test"
    for f in python_files:
        module = importlib.import_module(f"commands.{f[:-3]}")
        if hasattr(module, "trigger"):
            if(module.trigger(sentence)):
                module.command()
                return
     
exec()