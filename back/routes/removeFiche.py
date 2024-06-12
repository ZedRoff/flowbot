
from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_fiche', __name__)

@bp.route('/api/removeFiche', methods=['POST'])
def removeFiche():
    if request.method == 'POST':
        try:
            data = request.get_json()
            titre = data['titre']
            
            cur = con.cursor()
            cur.execute("SELECT * FROM fiches WHERE fiche=?", (titre,))
            if not cur.fetchone():
                return jsonify({'result': 'doesnt'})
            cur.close()
            cur = con.cursor()
            cur.execute("DELETE FROM fiches WHERE fiche=?", (titre,))
            con.commit()
            cur.close()
            response = jsonify({'result': 'success'})
            emit('message', {"from": "back", "type": "fiches_update"}, broadcast=True, namespace='/')
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        
