from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit
import sqlite3

bp = Blueprint('set_muted', __name__)

def get_db_connection():
    return sqlite3.connect("./db/database.db")

@bp.route('/api/setMuted', methods=['POST'])
def set_muted():
    if request.method == 'POST':
        data = request.get_json()
        voice = data.get('voice')
        mic = data.get('mic')

       

        try:
            con = get_db_connection()
            cur = con.cursor()
            cur.execute("UPDATE muted SET voice = ?, mic = ?", (voice, mic))
            con.commit()
            cur.close()
            emit('message', {"from": "back", "type": "muted_update", "voice": voice, "mic": mic}, broadcast=True, namespace='/')
            return jsonify({'result': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Method not allowed'})