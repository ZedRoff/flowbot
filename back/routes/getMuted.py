
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_muted', __name__)

@bp.route('/api/getMuted', methods=['GET'])
def get_muted():
    if request.method == 'GET':
        try:
            
            
            cur = con.cursor()
            cur.execute("SELECT * FROM muted")
            muted = cur.fetchall()
            cur.close()
            response = jsonify({'result': muted})
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        

