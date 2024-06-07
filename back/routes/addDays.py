from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit
import uuid

con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_days', __name__)

@bp.route('/api/addDays', methods=['POST'])
def add_days():
    try:
        if request.method == 'POST':
            data = request.get_json()
            # Générer un UUID
            uuid_value = str(uuid.uuid4())
            cur = con.cursor()
            cur.execute("INSERT INTO days (id, name, day, f, t) VALUES (?, ?, ?, ?, ?)", (uuid_value, data['name'], data['day'], data['f'], data['t']))
            con.commit()
            cur.close()
            emit('message', {"from": "back", "type": "timetable_update"}, broadcast=True, namespace='/')
            return jsonify({'result': 'success'})
        
    except Exception as e:
        return jsonify({'error': str(e)})