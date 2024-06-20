
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_rappel', __name__)

@bp.route('/api/removeRappel', methods=['POST'])
def remove_rappel():
    if request.method == 'POST':
        try:
            data = request.get_json()
            date = data['date']
            text = data['text']
            cur = con.cursor()
            cur.execute("DELETE FROM rappels WHERE date=? AND text=?", (date, text,))
            con.commit()
            cur.close()
            emit('message', {"from": "back", "type": "rappels_update"}, broadcast=True, namespace='/')
            
            return jsonify({'result': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)})
        
