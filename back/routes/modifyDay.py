from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit


con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('modify_day', __name__)

@bp.route('/api/modifyDay', methods=['POST'])
def delete_day():
    try:
        if request.method == 'POST':
            data = request.get_json()
            cur = con.cursor()
            cur.execute("UPDATE days SET name=?, day=?, f=?, t=? WHERE id=?", (data['name'], data['day'], data['f'], data['t'], data['id']))
            con.commit()
            cur.close()
            emit('message', {"from": "back", "type": "timetable_update"}, broadcast=True, namespace='/')
            return jsonify({'result': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)})















           