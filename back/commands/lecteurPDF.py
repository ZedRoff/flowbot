from utils.TextToSpeech import sayInstruction
import PyPDF2
import re
import threading 

def command():
    sayInstruction("Bien sûr, quel est le nom de celui-ci")

def specificity(param):
    thread = threading.Thread(target=readFile, args=(param,))
    thread.start()
    

def specificityName():
    return "lecteurPDF"

def trigger(pText):
    return ((re.search("lis",pText)) or (re.search("lit",pText) or (re.search("li",pText))or (re.search("dit",pText)))) and re.search("fichier", pText)
    
def readFile(param):
    pdfToRead = open(r"D:/a/flowbot/flowbot/file/pdf/"+param.lower()+".pdf", mode='rb')
    reader = PyPDF2.PdfReader(pdfToRead)
    for pages in reader.pages:
        text = pages.extract_text()
        sayInstruction(text)