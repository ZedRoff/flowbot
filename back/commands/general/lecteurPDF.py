
import PyPDF2
import re
import threading 
from utils.CommandMaker import CommandMaker

class Command(CommandMaker):

    def command(self):
        super().sayInstruction("Bien sûr, quel est le nom de celui-ci")

    def specificity(self, param):
   
        thread = threading.Thread(target=self.readFile, args=(param,))
        thread.start()
        super().resetAction()
    

    def trigger(self, pText):
        return ((re.search("lis",pText)) or (re.search("lit",pText) or (re.search("li",pText))or (re.search("dit",pText)))) and re.search("fichier", pText)
    
    def readFile(self, param):
        pdfToRead = open(r"D:/a/flowbot/flowbot/file/pdf/"+param.lower()+".pdf", mode='rb')
        reader = PyPDF2.PdfReader(pdfToRead)
        for pages in reader.pages:
            text = pages.extract_text()
            super().sayInstruction(text)
    def isSpecific(self):
        return True