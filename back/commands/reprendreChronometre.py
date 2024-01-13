from utils.TextToSpeech import sayInstruction
import re
import sqlite3


db = sqlite3.connect("./db/database.db", check_same_thread=False)




def command():
    sayInstruction("Reprise du chronomètre")
    cur = db.cursor()
    cur.execute("UPDATE chronometre SET active = ?", (1,))
    db.commit()
    cur.close()



def trigger(pText):
    return (re.search("reprendre", pText) or re.search("reprend", pText) or re.search("continue", pText)) and re.search("chronomètre", pText)
    
