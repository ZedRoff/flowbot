from flask import Blueprint, request, jsonify
import sqlite3

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('get_city', __name__)

@bp.route('/api/getCity', methods=['GET'])
def get_city():
    if request.method == 'GET':
        cur = db.cursor()
        res = cur.execute("SELECT * FROM city").fetchone()
        db.commit()
        cur.close()
        return jsonify({'result': res})
    
        