from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit


con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('delete_day', __name__)

@bp.route('/api/deleteDay', methods=['POST'])
def delete_day():
    try:
        if request.method == 'POST':
            data = request.get_json()
            cur = con.cursor()
            cur.execute("DELETE FROM days WHERE id=?", (data['id'],))
            con.commit()
            cur.close()
            emit('message', {"from": "back", "type": "timetable_update"}, broadcast=True, namespace='/')
            return jsonify({'result': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)})
    

           