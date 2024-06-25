from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit
import sqlite3

bp = Blueprint('set_train_name', __name__)

def get_db_connection():
    return sqlite3.connect("./db/database.db")

@bp.route('/api/setTrainName', methods=['POST'])
def set_train_name():
    if request.method == 'POST':
        data = request.get_json()
        train_name = data.get('name')

        if not train_name:
            return jsonify({'result': 'notprovided'})

        try:
            con = get_db_connection()
            cur = con.cursor()
            cur.execute("UPDATE train SET name=?", (train_name,))
            con.commit()
            cur.close()
            emit('message', {"from": "back", "type": "train_name_update"}, broadcast=True, namespace='/')
            return jsonify({'result': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Method not allowed'})
    