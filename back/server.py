import os
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import threading
from utils.SpeechToText import startup
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
con.commit()
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



@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    print("Message received : "+message)


if __name__ == '__main__':


    #socketio.run(app)
    threading.Thread(target=socketio.run, args=(app,)).start()
    threading.Thread(target=startup, args=()).start()
