import feedparser
from flask import Blueprint, request, jsonify
import sqlite3

bp = Blueprint('get_feds_url', __name__)

con = sqlite3.connect("./db/database.db", check_same_thread=False)
  


@bp.route('/api/getFeedsUrl', methods=['GET'])
def get_feds_url():
    try:
        if request.method == 'GET':
            with con:
                cur = con.cursor()
                cur.execute("SELECT * FROM feeds")
                links = cur.fetchall()
                cur.close()
            response = jsonify({'result': links})
            return response
    except Exception as e:
        return jsonify({'error': str(e)})
    

