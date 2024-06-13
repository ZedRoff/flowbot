from flask import Blueprint
import sqlite3
from flask import request, jsonify
from flask_socketio import emit
bp = Blueprint('remove_task', __name__)

con = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/removeTask', methods=['POST'])
def remove_task():
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
        cur.execute("DELETE FROM tasks WHERE name = ? AND category = ?", (name, category[0]))
        con.commit()
        cur.close()
        emit('message', {"from": "back", "type": "tasks_update"}, broadcast=True, namespace='/')
        response = jsonify({'result': 'success'})
        return response
    
    

