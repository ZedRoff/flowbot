from flask import Blueprint
import sqlite3
from flask import request, jsonify
from flask_socketio import SocketIO, emit
bp = Blueprint('add_task', __name__)

con = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/addTask', methods=['POST'])
def add_task():
    if request.method == 'POST':
        data = request.get_json()
        name = data['name']
        category = data['category']
        cur = con.cursor()
        cur.execute("SELECT * FROM categories WHERE name = ?", (category,))
        category = cur.fetchone()
        if category is None:
            response = jsonify({'result': 'categorydoesnotexists'})
            return response
        # check if the task already exists in this category
        cur.execute("SELECT * FROM tasks WHERE name = ? AND category = ?", (name, category[0]))
        task = cur.fetchone()
        if task is not None:
            response = jsonify({'result': 'already'})
            return response
        
        
        cur.execute("INSERT INTO tasks(name, category, status) VALUES(?, ?, ?)", (name, category[0], "attente"))
        con.commit()
        cur.close()
        emit('message', {"from": "back", "type": "tasks_update"}, broadcast=True, namespace='/')
        response = jsonify({'result': 'success'})
        return response
    
        
        
    

