
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_matieres', __name__)

@bp.route('/api/getMatieres', methods=['GET'])
def get_matieres():
    if request.method == 'GET':
        try:
            
            
            cur = con.cursor()
            cur.execute("SELECT * FROM notes")
            matieres = cur.fetchall()
            cur.close()
            response = jsonify({'result': matieres})
            return response
        except Exception as e:
            return jsonify({'error': str(e)})


