
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('modify_rappel', __name__)

@bp.route('/api/modifyRappel', methods=['POST'])
def modify_rappel():
    if request.method == 'POST':
        try:
            data = request.get_json()
            date = data['date']
            text = data['text']
            cur = con.cursor()
            cur.execute("UPDATE rappels SET text=? WHERE date=?", (text, date,))
            con.commit()
            cur.close()
            return jsonify({'result': 'success'})
        
        except Exception as e:
            return jsonify({'error': str(e)})
        
