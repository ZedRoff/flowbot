
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('get_rappels', __name__)

@bp.route('/api/getRappels', methods=['POST'])
def get_rappels():
    if request.method == 'POST':
        try:
            data = request.get_json()
            date = data['date']
            cur = con.cursor()
            cur.execute("SELECT * FROM rappels WHERE date=?", (date,))
            rows = cur.fetchall()
            cur.close()
            return jsonify({'result': rows})
        except Exception as e:
            return jsonify({'error': str(e)})
        
        