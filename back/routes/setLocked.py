
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('set_locked', __name__)

@bp.route('/api/setLocked', methods=['POST'])
def set_locked():
    if request.method == 'POST':
        try:
            data = request.get_json()
            matiere = data['matiere']
            locked = data['locked']
            cur = con.cursor()
            cur.execute("UPDATE notes SET locked = ? WHERE matiere = ?", (locked, matiere))
            con.commit()
            cur.close()
            response = jsonify({'result': 'success'})
            emit('message', {"from": "back", "type": "notes_update"}, broadcast=True, namespace='/')
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        