from json import dumps
array = ['some', 'thing', 'cool']
jsonarray = dumps(array)

import sqlite3
conn = sqlite3.connect("./db/database.db")
cur = conn.cursor()
cur.execute('''INSERT INTO Table textvariable = ?;''', jsonarray)
conn.commit()