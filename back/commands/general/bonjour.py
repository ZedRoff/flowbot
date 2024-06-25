
import random
from utils.CommandMaker import CommandMaker


class Command(CommandMaker):
 
    def command(self):
        greetings = ['Comment se passe votre journée ?', 'Que puis-je faire pour vous ?', 'Comment allez-vous ?', '']
        random_greeting = greetings[random.randint(0, len(greetings) - 1)]
        super().sayInstruction(f"Bonjour, {random_greeting}")
    def trigger(self, pText):
        return pText == "bonjour" or pText == "salut"
    def isSpecific(self):
        return False