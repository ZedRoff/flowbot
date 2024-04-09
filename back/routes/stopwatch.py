from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('stopwatch', __name__)

@bp.route('/api/stopwatch', methods=['POST'])
def stopwatch():
    if request.method == 'POST':
        data = request.get_json()
        cmd = data['action']
        if cmd == 'stop':
            cur = db.cursor()
            cur.execute("UPDATE chronometre SET active = 0")
            db.commit()
            cur.close()
            return jsonify({'message': 'ok'})
        elif cmd == 'start':
            cur = db.cursor()
            cur.execute("UPDATE chronometre SET active = 1")
            db.commit()
            cur.close()
            return jsonify({'message': 'ok'})
        elif cmd == 'resume':
            cur = db.cursor()
            cur.execute("UPDATE chronometre SET active = 1")
            db.commit()
            cur.close()
            return jsonify({'message': 'ok'})
        elif cmd == 'pause':
            cur = db.cursor()
            cur.execute("UPDATE chronometre SET active = 2")
            db.commit()
            cur.close()
            return jsonify({'message': 'ok'})
        elif cmd == 'get':
            cur = db.cursor()
            res = cur.execute("SELECT * FROM chronometre").fetchone()
            db.commit()
            cur.close()
            return jsonify({'result': res})
        else:
            return jsonify({'error': 'Invalid action'})

        


