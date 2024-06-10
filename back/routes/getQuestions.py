
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_questions', __name__)

@bp.route('/api/getQuestions', methods=['GET'])
def get_questions():
    if request.method == 'GET':
        cur = con.cursor()
        data = cur.execute("SELECT * FROM qcm").fetchall()
        cur.close()
        response = jsonify({'result': data})
        return response
    