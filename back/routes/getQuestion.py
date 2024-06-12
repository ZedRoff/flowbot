


from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_question', __name__)

@bp.route('/api/getQuestion', methods=['POST'])
def get_question():
    if request.method == 'POST':
        data = request.get_json()
        titre = data['titre']
        cur = con.cursor()
        cur.execute("SELECT * FROM qcm WHERE titre = ?", (titre,))
        data = cur.fetchall()
        cur.close()
        response = jsonify({'result': data})
        return response
    