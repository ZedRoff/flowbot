
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_pense_bete', __name__)

@bp.route('/api/removePenseBete', methods=['POST'])
def remove_pense_bete():
    if request.method == 'POST':
        titre = request.get_json()['title']
        cur = con.cursor()
        cur.execute("DELETE FROM pense_bete WHERE title=?", (titre,))
        con.commit()
        cur.close()
        response = jsonify({'result': 'success'})
        emit('message', {"from": "back", "type": "pense_bete_update"}, broadcast=True, namespace='/')
        return response
    else:
        return jsonify({'error': 'Method not allowed'})
    
    
       
