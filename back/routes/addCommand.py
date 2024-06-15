from flask import Blueprint
import sqlite3
from flask import request, jsonify
import uuid

bp = Blueprint('add_command', __name__)

@bp.route('/api/addCommand', methods=['POST'])
def add_command():
    if request.method == 'POST':
        data = request.get_json()
        name = data['name']
        reply = data['reply']
        con = sqlite3.connect("./db/database.db")
        cur = con.cursor()
        cur.execute("SELECT * FROM commandes WHERE name = ?", (name,))
        command = cur.fetchone()
        if command is not None:
            response = jsonify({'result': 'alreadyexists'})
            return response
        uuid_code = str(uuid.uuid4())
        cur.execute("INSERT INTO commandes(uuid, name, reply) VALUES(?, ?, ?)", (uuid_code, name, reply))
        con.commit()
        con.close()
        response = jsonify({'result': 'success', 'uuid': uuid_code})
        return response
    

