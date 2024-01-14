from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('change_background', __name__)

@bp.route('/api/changeBackground', methods=['POST'])
def change_background():
    if request.method == 'POST':
        data = request.get_json()
        color1 = data['color1']
        color2 = data['color2']
        cur = db.cursor()
        cur.execute("UPDATE background SET color1 = ?, color2 = ?", (color1, color2))
        db.commit()
        cur.close()
        response = jsonify({'result': 'success', 'color1': color1, 'color2': color2})
      
        return response
    


