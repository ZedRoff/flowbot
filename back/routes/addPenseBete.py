
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_pense_bete', __name__)

@bp.route('/api/addPenseBete', methods=['POST'])
def add_pense_bete():
    if request.method == 'POST':
        title = request.get_json()['title']
        content = request.get_json()['content']
        cur = con.cursor()
        cur.execute("SELECT * FROM pense_bete WHERE title=?", (title,))
        if cur.fetchone():
            return jsonify({'result': 'already'})
        

        cur = con.cursor()
        cur.execute("INSERT INTO pense_bete (title,content) VALUES (?,?)", (title,content,))
        con.commit()
        cur.close()
        response = jsonify({'result': 'success'})
        emit('message', {"from": "back", "type": "pense_bete_update"}, broadcast=True, namespace='/')
        return response
    else:
        return jsonify({'error': 'Method not allowed'})
    
       
