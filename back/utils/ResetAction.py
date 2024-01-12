import sqlite3

db = sqlite3.connect("./db/database.db")




def resetAction():
    cur = db.cursor()
    cur.execute("UPDATE global SET action = ?", ("",))
    db.commit()
    cur.close()