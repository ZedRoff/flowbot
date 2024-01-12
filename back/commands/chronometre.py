from utils.TextToSpeech import sayInstruction
import re
import datetime
import time
import threading 
import sqlite3

StartTime = 0

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



db = sqlite3.connect("./db/database.db", check_same_thread=False)
cur = db.cursor()


def command():
    sayInstruction("Bien sûr")
    startChronometre()

def specificity(param):
    print("ah")
    

def trigger(pText):
    return ((re.search("fais",pText)) or (re.search("fait",pText) or (re.search("créer",pText))or (re.search("créé",pText)))) and re.search("chronomètre", pText)

@bp.route('/api/chronometre', methods=['GET','POST'])
def startChronometre():
    data = request.get_json()
    name = data['name']
        
    StartTime = datetime.datetime.now().time().second+datetime.datetime.now().time().minute*60 + datetime.datetime.now().time().hour*60*60
    currentTime = 0
    pauseTime = 0
    while True :
        time.sleep(1)
        if not inPause:
            currentTime = datetime.datetime.now().time().second+datetime.datetime.now().time().minute*60 + datetime.datetime.now().time().hour*60*60-StartTime - pauseTime
        else :
            pauseTime+= datetime.datetime.now().time().second+datetime.datetime.now().time().minute*60 + datetime.datetime.now().time().hour*60*60
            
        con = sqlite3.connect("./db/database.db")
        cur = con.cursor()
        cur.execute("SELECT * FROM chronometre WHERE name = ?", (name,))
        uuid_code = str(uuid.uuid4())
        cur.execute("INSERT INTO chronometre(uuid, name, reply) VALUES(?, ?, ?)", (uuid_code, name, currentTime))
        con.commit()
        con.close()

    


class thread(threading.Thread): 
    def __init__(self, thread_name, thread_ID): 
        threading.Thread.__init__(self) 
        self.thread_name = thread_name 
        self.thread_ID = thread_ID 
 
        # helper function to execute the threads
    def run(self): 
        StartTime = datetime.datetime.now().time().second+datetime.datetime.now().time().minute*60 + datetime.datetime.now().time().hour*60*60
        currentTime = 0
        pauseTime = 0
        while True :
            time.sleep(1)
            if not inPause:
                currentTime = datetime.datetime.now().time().second+datetime.datetime.now().time().minute*60 + datetime.datetime.now().time().hour*60*60-StartTime - pauseTime
            else :
                pauseTime+= datetime.datetime.now().time().second+datetime.datetime.now().time().minute*60 + datetime.datetime.now().time().hour*60*60
            print(currentTime)
