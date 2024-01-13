from utils.TextToSpeech import sayInstruction
import PyPDF2
import re
import threading 
from utils.ResetAction import resetAction
in_specificity = False
def command():
    sayInstruction("Bien sûr, quel est le nom de celui-ci")

def specificity(param):
    global in_specificity
    thread = threading.Thread(target=readFile, args=(param,))
    thread.start()
    resetAction()
    in_specificity = False
    

def getInSpecificity():
    return in_specificity

def trigger(pText):
    return ((re.search("lis",pText)) or (re.search("lit",pText) or (re.search("li",pText))or (re.search("dit",pText)))) and re.search("fichier", pText)
    
def readFile(param):
    pdfToRead = open(r"D:/a/flowbot/flowbot/file/pdf/"+param.lower()+".pdf", mode='rb')
    reader = PyPDF2.PdfReader(pdfToRead)
    for pages in reader.pages:
        text = pages.extract_text()
        sayInstruction(text)