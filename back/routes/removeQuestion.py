
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_question', __name__)

@bp.route('/api/removeQuestion', methods=['POST'])
def removeQuestion():
    if request.method == 'POST':
        try:
            data = request.get_json()
            question = data['question']
            titre = data['titre']
            
            cur = con.cursor()
            cur.execute("SELECT * FROM qcm WHERE question=? AND titre=?", (question,titre,))
            if not cur.fetchone():
                return jsonify({'result': 'doesnt'})
            
            cur = con.cursor()
            cur.execute("DELETE FROM qcm WHERE question=? AND titre=?", (question,titre,))
            con.commit()
            cur.close()

            response = jsonify({'result': 'success'})
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        
