
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_pense_bete', __name__)

@bp.route('/api/getPenseBete', methods=['GET'])
def get_pense_bete():
    if request.method == 'GET':
        try:
            cur = con.cursor()
            cur.execute("SELECT * FROM pense_bete")
            pense_bete = cur.fetchall()
            cur.close()
            return jsonify({'result': pense_bete })
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Method not allowed'})
    