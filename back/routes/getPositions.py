from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('get_positions', __name__)

@bp.route('/api/getPositions', methods=['GET'])
def get_positions():
    if request.method == 'GET':
        cur = db.cursor()
        data = cur.execute("SELECT liste FROM positions").fetchone()
        liste = data[0].split("|")
        cur.close()
        response = jsonify({'result': liste})
        return response


    


