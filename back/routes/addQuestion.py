
import feedparser


from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('add_question', __name__)

@bp.route('/api/addQuestion', methods=['POST'])
def add_question():
    if request.method == 'POST':
        try:
            data = request.get_json()
            question = data['question']
            choix = data['choix']
            titre = data['titre']
           
            # check if already exists
            cur = con.cursor()
            cur.execute("SELECT * FROM qcm WHERE titre=?", (question,))
            print(question)
            if cur.fetchone():
                print(cur.fetchone())
                return jsonify({'result': 'already'})
            
            cur = con.cursor()


            cur.execute("INSERT INTO qcm (question, choix, titre) VALUES (?, ?, ?)", (question, choix, titre))
            
            con.commit()
            cur.close()
            response = jsonify({'result': 'success'})
            emit('message', {"from": "back", "type": "qcm_update"}, broadcast=True, namespace='/')
            return response
        except Exception as e:
            return jsonify({'error': str(e)})
        
