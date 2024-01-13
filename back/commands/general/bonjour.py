from utils.TextToSpeech import sayInstruction
from utils.GetRandom import getRandomFromArray

def command():
    greetings = ['Comment se passe votre journée ?', 'Que puis-je faire pour vous ?', 'Comment allez-vous ?', '']
    random_greeting = getRandomFromArray(greetings)
    sayInstruction(f"Bonjour, {random_greeting}")

def trigger(pText):
    return pText == "bonjour" or pText == "salut"