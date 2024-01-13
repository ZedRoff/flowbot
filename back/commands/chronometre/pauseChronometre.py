from utils.TextToSpeech import sayInstruction
import re
import sqlite3


db = sqlite3.connect("./db/database.db", check_same_thread=False)




def command():
    sayInstruction("Chronomètre mit en pause")
    cur = db.cursor()
    cur.execute("UPDATE chronometre SET active = ?", (2,))
    db.commit()
    cur.close()



def trigger(pText):
    return re.search("pose", pText) and re.search("chronomètre", pText)
    
