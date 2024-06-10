

from flask import Blueprint, request, jsonify
from flask_socketio import emit
import os
import sqlite3

bp = Blueprint('get_fiches', __name__)
db = sqlite3.connect("./db/database.db", check_same_thread=False)




def check_duplicate(dict, key):
    for d in dict:
        print(d['title'], key)
        if d['title'] == key:
            return True
    return False

@bp.route('/api/getFiches', methods=['GET'])
def get_fiches():
    cur = db.cursor()
    cur.execute("SELECT * FROM fiches")
    fiches = cur.fetchall()
    cur.close()
    corr = []
    for f in fiches:
        if not check_duplicate(corr, f[3]):
            corr.append({"title": f[3], "description": f[4]})

    return jsonify({'result': corr})


    
'''
type TEXT,
            title TEXT,
            content TEXT,
            fiche TEXT
            '''