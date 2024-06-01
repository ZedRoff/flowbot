from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('has_finished_starter', __name__)

@bp.route('/api/hasFinishedStarter', methods=['GET'])
def get_positions():
    if request.method == 'GET':
        cur = db.cursor()
        data = cur.execute("SELECT has_finished FROM starter").fetchone()
        has_finished = data[0]
        cur.close()
        response = jsonify({'result': has_finished})
        return response
    

    


