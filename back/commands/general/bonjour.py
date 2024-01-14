

from utils.CommandMaker import CommandMaker


class Command(CommandMaker):
 
    def command(self):
        greetings = ['Comment se passe votre journée ?', 'Que puis-je faire pour vous ?', 'Comment allez-vous ?', '']
        random_greeting = super().getRandomFromArray(greetings)
        super().sayInstruction(f"Bonjour, {random_greeting}")
    def trigger(self, pText):
        return pText == "bonjour" or pText == "salut"
    def isSpecific(self):
        return False