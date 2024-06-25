from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import SocketIO, emit

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('change_background', __name__)

@bp.route('/api/changeBackground', methods=['POST'])
def change_background():
    if request.method == 'POST':
        data = request.get_json()
        url = data['url']
      
        cur = db.cursor()
      
        cur.execute("UPDATE background SET url = ?", (url,))
        db.commit()
        cur.close()
        emit('message', {"from": "back", "type": "background_update"}, broadcast=True, namespace='/')
        response = jsonify({'result': 'success'})
        return response
    


