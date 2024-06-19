
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_rappel', __name__)

@bp.route('/api/addRappel', methods=['POST'])
def add_rappel():
    if request.method == 'POST':
        try:
            data = request.get_json()
            date = data['date']
            text = data['text']
            color = data['color']
            
            # check if it already exists
            cur = con.cursor()
            cur.execute("SELECT * FROM rappels WHERE text = ? AND date = ?", (text,date,))
            if cur.fetchone():
                return jsonify({'result': 'already'})
            cur.close()

            cur = con.cursor()
            cur.execute("INSERT INTO rappels (text, date, color) VALUES (?, ?, ?)", (text, date,color,))
            con.commit()
            cur.close()
            return jsonify({'result': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)})
        
