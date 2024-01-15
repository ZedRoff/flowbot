import os
import json
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import sqlite3
from dotenv import dotenv_values


config = dotenv_values(".env")

con = sqlite3.connect("./db/database.db")
cur = con.cursor()




cur.execute('''
            CREATE TABLE IF NOT EXISTS commandes(
            uuid TEXT PRIMARY KEY,
            name TEXT,
            reply TEXT     
)''')

cur.execute('''
            CREATE TABLE IF NOT EXISTS global(
            action TEXT PRIMARY KEY
            )
            ''')
con.commit()


cur.execute('''
            CREATE TABLE IF NOT EXISTS chronometre(
            active INTEGER PRIMARY KEY
            )
            ''')

con.commit()

cur.execute('''
            CREATE TABLE IF NOT EXISTS minuteur(
                min TEXT PRIMARY KEY,
                active INTEGER
            )
            ''')

con.commit()

con.execute('''
            CREATE TABLE IF NOT EXISTS devoirs(
                lundi TEXT,
                mardi TEXT,
                mercredi TEXT,
                jeudi TEXT,
                vendredi TEXT,
                samedi TEXT,
                dimanche TEXT
            )
            ''')
con.commit()

cur.execute('''
            CREATE TABLE IF NOT EXISTS reveil(
                time TEXT PRIMARY KEY,
                active INTEGER
            )
            ''')

con.commit()

cur.execute('''
            CREATE TABLE IF NOT EXISTS rappels(
                liste TEXT
            )
            ''')
con.commit()

con.execute('''
            CREATE TABLE IF NOT EXISTS background(
                color1 TEXT,
                color2 TEXT
            )
            ''')
con.commit()

cur.execute('''
            CREATE TABLE IF NOT EXISTS positions(
                liste TEXT
            )
            ''')

res_test = cur.execute("SELECT * FROM positions").fetchone()
if res_test is None:
    cur.execute("INSERT INTO positions VALUES (?)", ("chronometre|rappels|minuteur|fiches",))
    con.commit()
res_test = cur.execute("SELECT * FROM commandes").fetchone()
if res_test is None:
    cur.execute("INSERT INTO commandes VALUES (?, ?, ?)", ("", "", ""))
    con.commit()
res_test = cur.execute("SELECT * FROM minuteur").fetchone()
if res_test is None:
    cur.execute("INSERT INTO minuteur VALUES (?, ?)", ("", 0))
    con.commit()
res_test = cur.execute("SELECT * FROM reveil").fetchone()
if res_test is None:
    cur.execute("INSERT INTO reveil VALUES (?, ?)", ("", 0))
    con.commit()
res_test = cur.execute("SELECT * FROM background").fetchone()
if res_test is None:
    cur.execute("INSERT INTO background VALUES (?, ?)", ("#6d0069", "#000b60"))
    con.commit()
res_test = cur.execute("SELECT action FROM global").fetchone()
if res_test is None:
    cur.execute("INSERT INTO global VALUES (?)", ("",))
    con.commit()
res_test = cur.execute("SELECT active FROM chronometre").fetchone()
if res_test is None:
    cur.execute("INSERT INTO chronometre VALUES (?)", (0,))
    con.commit()
res_test = cur.execute("SELECT * FROM devoirs").fetchone()
if res_test is None:
    cur.execute("INSERT INTO devoirs VALUES (?, ?, ?, ?, ?, ?, ?)", ("", "", "", "", "", "", ""))
    con.commit()
res_test = cur.execute("SELECT * FROM rappels").fetchone()
if res_test is None:
    cur.execute("INSERT INTO rappels VALUES (?)", ("",))
    con.commit()



cur.execute("UPDATE chronometre SET active = ?", (0,))
con.commit()
cur.execute("UPDATE global SET action = ?", ("",))
con.commit()

cur.close()
con.close()

app = Flask(__name__)
app.config['SECRET_KEY'] = config.get('SECRET')
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

def import_routes():
    routes_dir = os.path.join(os.path.dirname(__file__), 'routes')
    for filename in os.listdir(routes_dir):
        if filename.endswith('.py'):
            module_name = filename[:-3]
            module = __import__(f'routes.{module_name}', fromlist=[''])
            app.register_blueprint(module.bp)
import_routes()

# Get URL from config.json
with open('../config.json') as config_file:
    config_data = json.load(config_file)
    host = config_data.get('URL')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    print("Message received : " + message)


if __name__ == '__main__':
    socketio.run(app, host=host, port=5000, debug=True, use_reloader=True)
