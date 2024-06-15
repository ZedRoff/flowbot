
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_note', __name__)

@bp.route('/api/removeNote', methods=['POST'])
def remove_note():
    if request.method == 'POST':
        try:
            data = request.get_json()
            matiere = data['matiere']
            cur = con.cursor()
            cur.execute("SELECT * FROM notes WHERE matiere=?", (matiere,))
            if not cur.fetchone():
                return jsonify({'result': 'not_found'})
            
            cur = con.cursor()
            cur.execute("DELETE FROM notes WHERE matiere=?", (matiere,))
            con.commit()
            cur.close()
            response = jsonify({'result': 'success'})

            emit('message', {"from": "back", "type": "notes_update"}, broadcast=True, namespace='/')
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        