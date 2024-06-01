from flask import Blueprint, request, jsonify
import sqlite3

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('change_city', __name__)

@bp.route('/api/changeCity', methods=['POST'])
def change_city():
    if request.method == 'POST':
        data = request.get_json()
        city = data['city']
        cur = db.cursor()
        
        cur.execute("UPDATE city SET city = ?", (city,))
        db.commit()
        cur.close()
        return jsonify({'result': 'success', 'city': city})
        
    
   
    


