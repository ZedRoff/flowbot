from flask import Blueprint
import sqlite3
from flask import request, jsonify


bp = Blueprint('delete_command', __name__)

@bp.route('/api/deleteCommand', methods=['POST'])
def add_command():
    if request.method == 'POST':
        data = request.get_json()
        uuid = data['uuid']
        if uuid is None or len(uuid) == 0:
            response = jsonify({'result': 'error'})
            return response
        con = sqlite3.connect("./db/database.db")
        cur = con.cursor()
        cur.execute("DELETE FROM commandes WHERE uuid = ?", (uuid,))
        con.commit()
        con.close()
        response = jsonify({'result': 'success'})
        return response
    
    

