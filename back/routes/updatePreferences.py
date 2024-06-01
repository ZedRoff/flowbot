from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('update_preferences', __name__)

@bp.route('/api/updatePreferences', methods=['POST'])
def get_positions():
    if request.method == 'POST':
        cur = db.cursor()
        data = request.get_json()
        cur.execute("UPDATE preferences SET voice = ?, name = ?", (data['voice'], data['name']))
        db.commit()
        cur.close()
        return jsonify({'message': 'Preferences updated successfully'})

      

    


