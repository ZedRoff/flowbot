
import re
import time
import threading 

from utils.CommandMaker import CommandMaker


convertStringToNum = {"zéro": 00, "un": 1, "une": 1, "deux": 2, "trois": 3, "quatre": 4, "cinq": 5, "six": 6, "sept": 7, "huit": 8, "neuf": 9, "dix": 10, "onze": 11, "douze": 12, "treize": 13, "quatorze": 14, "quinze": 15, "seize": 16, "dix-sept": 17, "dix-huite": 18, "dix-neuf": 19, "vingt": 20, "vingt et un": 21, "vingt-deux": 22, "vingt-trois": 23, "vingt-quarte": 24, "vingt-cinq": 25, "vingt-six": 26, "vingt-sept": 27, "vingt-huit": 28, "vingt-neuf": 29, "trente": 30, "trente et un": 31, "trente-deux": 32, "trente-trois": 33, "trente-quatre": 34, "trente-cinq": 35, "trente-six": 36, "trente-sept": 37, "trente-huite": 38, "trente-neuf": 39, "quarante": 40, "quarante et un": 41, "quarante-deux": 42, "quarante-trois": 43, "quarante-quatre": 44, "quarante-cinq": 45, "quarante-six": 46, "quarante-sept": 47, "quarante-huite": 48, "quarante-neuf": 49, "cinquante": 50, "cinquante et un": 51, "cinquante-deux": 52, "cinquante-trois": 53, "cinquante-quatre": 54, "cinquante-cinq": 55, "cinquante-six": 56, "cinquante-sept": 57, "cinquante-huite": 58, "cinquante-neuf": 59, "soixante": 60}
stopwatch_start_time = None
elapsed_time = 0

class Command(CommandMaker):
  
    def command(self):
        active = super().readDb("SELECT active FROM chronometre")
        if active == 1 or active == 2:
            super().sayInstruction("Un chronomètre est déjà en cours")
            return
        super().sayInstruction("Un chronomètre a été créé")
        super().writeDb("UPDATE chronometre SET active = 1")
        self.startChronometre()
      
    def trigger(self, pText):
        return (re.search("créer", pText) or re.search("crée", pText) or re.search("fais", pText) or re.search("fait", pText) or re.search("lance", pText)) and (re.search("chronomètre", pText) or re.search("chronometre", pText) or re.search("chrono", pText) or re.search("chronos", pText))

    def startChronometre(self):
        global stopwatch_start_time   
        thread1 = threading.Thread(target=self.run)
        stopwatch_start_time = time.time()
        thread1.start()


    def time_convert(self, sec):
        mins = sec // 60
        sec = sec % 60
        hours = mins // 60
        mins = mins % 60
        return "{0}:{1}:{2}".format(int(hours),int(mins),int(sec))


    def run(self): 
        global stopwatch_start_time, elapsed_time
        
        while True:
            
            time.sleep(1)
            active = super().readDb("SELECT active FROM chronometre")
            if active == 1:
                elapsed_time = time.time() - stopwatch_start_time
                
                
                
            elif active == 0:
                stopwatch_start_time = None
                elapsed_time = 0
                return
            else:
                stopwatch_start_time = time.time() - elapsed_time
            formated_time= self.time_convert(elapsed_time)
            super().emitMessage(formated_time, "stopwatch")    
    def isSpecific(self):
        return False