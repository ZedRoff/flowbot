from utils.TextToSpeech import sayInstruction
import re
import time
import threading 
import sqlite3
db = sqlite3.connect("./db/database.db", check_same_thread=False)


convertStringToNum ={
    "zéro" : 00,
    "un" : 1,
    "une" : 1,
    "deux" : 2,
    "trois" : 3,
    "quatre" : 4,
    "cinq" : 5,
    "six" : 6,
    "sept" : 7,
    "huit" : 8,
    "neuf" : 9,
    "dix" : 10,
    "onze" : 11,
    "douze" : 12,
    "treize" : 13,
    "quatorze" : 14,
    "quinze" : 15,
    "seize" : 16,
    "dix-sept" : 17,
    "dix-huite" : 18,
    "dix-neuf" : 19,
    "vingt" : 20,
    "vingt et un" : 21,
    "vingt-deux" : 22,
    "vingt-trois" : 23,
    "vingt-quarte" : 24,
    "vingt-cinq" : 25,
    "vingt-six" : 26,
    "vingt-sept" : 27,
    "vingt-huit" : 28,
    "vingt-neuf" : 29,
    "trente" : 30,
    "trente et un" : 31,
    "trente-deux" : 32,
    "trente-trois" : 33,
    "trente-quatre" : 34,
    "trente-cinq" : 35,
    "trente-six" : 36,
    "trente-sept" : 37,
    "trente-huite" : 38,
    "trente-neuf" : 39,
    "quarante" : 40,
    "quarante et un" : 41,
    "quarante-deux" : 42,
    "quarante-trois" : 43,
    "quarante-quatre" : 44,
    "quarante-cinq" : 45,
    "quarante-six" : 46,
    "quarante-sept" : 47,
    "quarante-huite" : 48,
    "quarante-neuf" : 49,
    "cinquante" : 50,
    "cinquante et un" : 51,
    "cinquante-deux" : 52,
    "cinquante-trois" : 53,
    "cinquante-quatre" : 54,
    "cinquante-cinq" : 55,
    "cinquante-six" : 56,
    "cinquante-sept" : 57,
    "cinquante-huite" : 58,
    "cinquante-neuf" : 59,
    "soixante" : 60,
}


def command():
    active = db.execute("SELECT active FROM chronometre").fetchone()[0]
    if active == 1 or active == 2:
        sayInstruction("Un chronomètre est déjà en cours")
        return
    sayInstruction("Un chronomètre a été créé")
    startChronometre()
    cur = db.cursor()
    cur.execute("UPDATE chronometre SET active = ?", (1,))
    db.commit()
    cur.close()


def trigger(pText):
    return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("chronomètre", pText)


stopwatch_start_time = None
def startChronometre():
    global stopwatch_start_time   
    thread1 = threading.Thread(target=run)
    stopwatch_start_time = time.time()
    thread1.start()

flag = True

def time_convert(sec):
  mins = sec // 60
  sec = sec % 60
  hours = mins // 60
  mins = mins % 60
  print("{0}:{1}:{2}".format(int(hours),int(mins),int(sec)))


def run(): 
    global flag, stopwatch_start_time
    while flag:
        time.sleep(1)
        active = db.execute("SELECT active FROM chronometre").fetchone()[0]
        if active == 1:
            elapsed_time = time.time() - stopwatch_start_time
            time_convert(elapsed_time)
        elif active == 0:
            stopwatch_start_time = None
            return
        else:
            stopwatch_start_time = time.time() - elapsed_time
