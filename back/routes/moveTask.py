from flask import Blueprint, request, jsonify
import sqlite3
from flask_socketio import emit

bp = Blueprint('move_task', __name__)

con = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/moveTask', methods=['POST'])
def move_task():
    if request.method == 'POST':
        data = request.get_json()
        name = data['name']
        from_category = data['fromCategory']
        to_category = data['toCategory']
        print(name, from_category, to_category)
        cur = con.cursor()

        cur.execute("SELECT * FROM tasks WHERE name = ? AND category = ?", (name, from_category))
        task = cur.fetchone()
        if task is None:
            response = jsonify({'result': 'tasknotfound'})
            return response

        cur.execute("SELECT * FROM categories WHERE name = ?", (to_category,))
        category = cur.fetchone()
        if category is None:
            response = jsonify({'result': 'destinationcategorynotfound'})
            return response
        # check if the task already exists in this category
        cur.execute("SELECT * FROM tasks WHERE name = ? AND category = ?", (name, to_category))
        task = cur.fetchone()
        if task is not None:
            response = jsonify({'result': 'already'})
            return response
        
        cur.execute("UPDATE tasks SET category = ? WHERE name = ? AND category = ?", (to_category, name, from_category))
        con.commit()
        cur.close()

        emit('message', {"from": "back", "type": "tasks_update"}, broadcast=True, namespace='/')

        response = jsonify({'result': 'success'})
        return response
