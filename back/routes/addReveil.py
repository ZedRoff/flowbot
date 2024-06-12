
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_reveil', __name__)

@bp.route('/api/addReveil', methods=['POST'])
def add_reveil():
    if request.method == 'POST':
        try:
            data = request.get_json()
            time = data['time']
            cursor = con.cursor()
            cursor.execute('SELECT * FROM reveil WHERE time = ?', (time,))
            if cursor.fetchone():
                return jsonify({'result': 'already'})
            
            cursor.execute('INSERT INTO reveil (time) VALUES (?)', (time,))
            con.commit()
            cursor.close()
            emit('message', {"from": "back", "type": "reveil_update"}, broadcast=True, namespace='/')
            return jsonify({'result': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)})
        
        
