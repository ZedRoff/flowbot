
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('flush_db', __name__)

@bp.route('/api/flushDb', methods=['GET'])
def flush_db():
    if request.method == 'GET':
        try:
            cur = con.cursor()
            cur.execute("DELETE FROM preferences")
            cur.execute("DELETE FROM muted")
            cur.execute("DELETE FROM rappels")
            cur.execute("DELETE FROM background")
            cur.execute("DELETE FROM categories")
            cur.execute("DELETE FROM chronometre")
            cur.execute("DELETE FROM city")
            cur.execute("DELETE FROM commandes")
            cur.execute("DELETE FROM ")
            con.commit()
            cur.close()
            return jsonify({'result': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)})

