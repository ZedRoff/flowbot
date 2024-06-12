
from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_qcm', __name__)

@bp.route('/api/removeQcm', methods=['POST'])
def removeQcm():
    if request.method == 'POST':
        try:
            data = request.get_json()
            titre = data['titre']
            
            cur = con.cursor()
            cur.execute("SELECT * FROM qcm WHERE titre=?", (titre,))
            if not cur.fetchone():
                return jsonify({'result': 'doesnt'})
            cur.close()
            cur = con.cursor()
            cur.execute("DELETE FROM qcm WHERE titre=?", (titre,))
            con.commit()
            cur.close()
            
            response = jsonify({'result': 'success'})
            emit('message', {"from": "back", "type": "qcm_update"}, broadcast=True, namespace='/')
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        
