from utils.TextToSpeech import sayInstruction
from PyPDF2 import PdfReader
import re

def command():
    sayInstruction("Bien sûr, quel est le nom de celui-ci")

def specificity(param):
    readFile(param)
    

def specificityName():
    return "lecteurPDF"

def trigger(pText):
    return ((re.search("lis",pText)) or (re.search("lit",pText) or (re.search("li",pText))or (re.search("dit",pText)))) and re.search("fichier", pText)
    
def readFile(param):
    reader = PdfReader.readFile(param+".pdf")
    for pages in reader.pages:
        text = pages.extract_text()
        sayInstruction(text)