from flask import Blueprint, request, jsonify
import sqlite3

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('change_positions', __name__)

@bp.route('/api/changePositions', methods=['POST'])
def change_positions():
    if request.method == 'POST':
        data = request.get_json()
        topLeft = data['topLeft']
        topRight = data['topRight']
        bottomLeft = data['bottomLeft']
        bottomRight = data['bottomRight']
      
        liste = [topLeft, topRight, bottomLeft, bottomRight]
        liste = [str(x) for x in liste]
        cur = db.cursor()
        liste = "|".join(liste)
      
        cur.execute("UPDATE positions SET liste = ?", (liste,))
        db.commit()
        cur.close()

        response = jsonify({'result': 'success'})
        return response
      
   
    


