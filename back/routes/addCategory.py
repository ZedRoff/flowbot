from flask import Blueprint
import sqlite3
from flask import request, jsonify
from flask_socketio import emit

bp = Blueprint('add_category', __name__)

con = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/addCategory', methods=['POST'])
def add_category():
    if request.method == 'POST':
        data = request.get_json()
        name = data['name']
        cur = con.cursor()

        cur.execute("SELECT * FROM categories WHERE name = ?", (name,))
        category = cur.fetchone()
        if category is not None:
            response = jsonify({'result': 'alreadyexists'})
            return response
        
        cur.execute("INSERT INTO categories(name) VALUES(?)", (name,))
        con.commit()
        cur.close()
        response = jsonify({'result': 'success'})
        emit('message', {"from": "back", "type": "tasks_update"}, broadcast=True, namespace='/')
        return response
    
        
    

