from flask import Blueprint, request, jsonify
import sqlite3

bp = Blueprint('get_train_name', __name__)

def get_db_connection():
    return sqlite3.connect("./db/database.db")

@bp.route('/api/getTrainName', methods=['GET'])
def get_train_name():
    if request.method == 'GET':
        try:
            con = get_db_connection()
            cur = con.cursor()
            cur.execute("SELECT * FROM train")
            train_name = cur.fetchone()
            cur.close()
            return jsonify({'result': train_name })
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Method not allowed'})
    