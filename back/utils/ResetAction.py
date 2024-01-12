import sqlite3

db = sqlite3.connect("./db/database.db")
cur = db.cursor()



def resetAction():
    cur.execute("UPDATE global SET action = ?", ("",))
    db.commit()
    db.close()