from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('set_finished_starter', __name__)

@bp.route('/api/setFinishedStarter', methods=['POST'])
def get_positions():
    if request.method == 'POST':
        cur = db.cursor()
        data = request.get_json()

        cur.execute(f"UPDATE starter SET has_finished = {data['has_finished']}")
        db.commit()
        cur.close()
        response = jsonify({'result': 'success'})
        return response

      

    


