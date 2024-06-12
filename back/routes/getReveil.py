
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_reveil', __name__)

@bp.route('/api/getReveil', methods=['GET'])
def get_reveil():
    if request.method == 'GET':
        try:
            cur = con.cursor()
            cur.execute("SELECT * FROM reveil")
            rows = cur.fetchall()
            cur.close()
            return jsonify({'result': rows})
        
        except Exception as e:
            return jsonify({'error': str(e)})
        
        
