
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_note', __name__)

@bp.route('/api/addNote', methods=['POST'])
def add_note():
    if request.method == 'POST':
        try:
            data = request.get_json()
            matiere = data['matiere']
            cur = con.cursor()
            cur.execute("SELECT * FROM notes WHERE matiere=?", (matiere,))
            if cur.fetchone():
                return jsonify({'result': 'already'})
            
            note = data['note']
            coefficient = data['coefficient']
            locked = data['locked']
            cur = con.cursor()
            cur.execute("INSERT INTO notes (matiere, note, coefficient, locked) VALUES (?, ?, ?, ?)", (matiere, note, coefficient, locked))
            con.commit()
            cur.close()
            response = jsonify({'result': 'success'})
            emit('message', {"from": "back", "type": "notes_update"}, broadcast=True, namespace='/')
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        
