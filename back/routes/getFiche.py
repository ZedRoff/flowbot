

from flask import Blueprint, request, jsonify
from flask_socketio import emit
import os
import sqlite3

bp = Blueprint('get_fiche', __name__)
db = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/getFiche', methods=['POST'])
def get_fiche():
    data = request.get_json()
    fiche = data['fiche']
    cur = db.cursor()
    cur.execute("SELECT * FROM fiches WHERE fiche = ?", (fiche,))
    fiches = cur.fetchall()
    cur.close()
    d = []
    for f in fiches:
        corr = {}
        corr["type"] = f[0]
        corr["title"] = f[1]
        corr["content"] = f[2]
        corr["fiche"] = f[3]
        corr["description"] = f[4]  
        d.append(corr)
    return jsonify({'result': d})
    
'''
type TEXT,
            title TEXT,
            content TEXT,
            fiche TEXT
            description TEXT
            '''