from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('get_background', __name__)

@bp.route('/api/getBackground', methods=['GET'])
def get_background():
    if request.method == 'GET':
        cur = db.cursor()
        cur.execute("SELECT * FROM background")
        rows = cur.fetchall()
        cur.close()
        response = jsonify({'result': rows})
        return response


    


