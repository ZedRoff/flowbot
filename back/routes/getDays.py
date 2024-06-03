from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_days', __name__)

@bp.route('/api/getDays', methods=['GET'])
def get_days():
    try:
        if request.method == 'GET':
           
            cur = con.cursor()
            cur.execute("SELECT * FROM days")
            rows = cur.fetchall()
            cur.close()
            response = jsonify({'result': rows})
            return response
        
    except Exception as e:
        return jsonify({'error': str(e)})
