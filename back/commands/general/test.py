

from utils.CommandMaker import CommandMaker

name = ""
age = 0
step = "name"
class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Quel est ton nom ?")
    def specificity(self, param): 
        global step, name, age
        if step == "name":
            name = param
            super().sayInstruction("Ok, quel est ton age ?")
            step = "age"
        elif step == "age":
            age = param
            super().sayInstruction("Ok, tu t'appelles "+name+" et tu as "+age+" ans")
            super().resetAction()
            step = "name"
        return True
    def trigger(self, pText):
        return pText == "test"
    def isSpecific(self):
        return True