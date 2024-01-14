from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_commands', __name__)

@bp.route('/api/getCommands', methods=['GET'])
def get_commands():
    try:
        if request.method == 'GET':
           
            cur = con.cursor()
            cur.execute("SELECT * FROM commandes")
            rows = cur.fetchall()
            cur.close()
            response = jsonify({'result': rows})
            return response
    except Exception as e:
        return jsonify({'error': str(e)})
