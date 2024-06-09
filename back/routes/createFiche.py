

from flask import Blueprint, request, jsonify
from flask_socketio import emit
import os
import sqlite3

bp = Blueprint('create_fiche', __name__)
db = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/createFiche', methods=['POST'])
def create_fiche():
    data = request.get_json()
    fiche = data['fiche']
    ficheTitle = data["ficheTitle"]
    ficheDescription = data["ficheDescription"]
    cur = db.cursor()
    print(ficheTitle)


    
    cur.execute("SELECT * FROM fiches WHERE fiche = ?", (ficheTitle,))
    fq = cur.fetchall()
    if fq:
        return jsonify({'result': 'already'})
    
    for f in fiche:
        print(f)
        
        cur.execute("INSERT INTO fiches (type, title, content, fiche, description) VALUES (?, ?, ?, ?, ?)", (f['type'], f['title'], f['content'], ficheTitle, ficheDescription))
        db.commit()
    
    cur.close()


    emit('message', {"from": "back", "type": "fiches_update"}, broadcast=True, namespace='/')
    return jsonify({'result': 'success'})
    
'''
type TEXT,
            title TEXT,
            content TEXT,
            fiche TEXT
            description TEXT
            '''