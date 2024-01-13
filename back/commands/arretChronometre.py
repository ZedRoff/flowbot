from utils.TextToSpeech import sayInstruction
import re
import sqlite3


db = sqlite3.connect("./db/database.db", check_same_thread=False)




def command():
    sayInstruction("Arrêt du chronomètre")
    cur = db.cursor()
    cur.execute("UPDATE chronometre SET active = ?", (0,))
    db.commit()
    cur.close()



def trigger(pText):
    return (re.search("arrêt", pText) or re.search("arrête", pText) or re.search("stop", pText)) and re.search("chronomètre", pText)
    
