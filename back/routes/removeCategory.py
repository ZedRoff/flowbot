from flask import Blueprint
import sqlite3
from flask import request, jsonify
from flask_socketio import emit
bp = Blueprint('remove_category', __name__)

con = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/removeCategory', methods=['POST'])
def remove_category():
    if request.method == 'POST':
        data = request.get_json()
        name = data['name']
        cur = con.cursor()

        cur.execute("SELECT * FROM categories WHERE name = ?", (name,))
        category = cur.fetchone()
        if category is None:
            response = jsonify({'result': 'doesnotexists'})
            return response
        
        cur.execute("DELETE FROM categories WHERE name = ?", (name,))
        con.commit()
        cur.close()
        response = jsonify({'result': 'success'})
        emit('message', {"from": "back", "type": "tasks_update"}, broadcast=True, namespace='/')
        return response
    
        
    

