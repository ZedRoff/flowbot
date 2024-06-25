from flask import Blueprint, request, jsonify
import sqlite3
import requests

db = sqlite3.connect("./db/database.db", check_same_thread=False)



bp = Blueprint('get_preferences', __name__)

@bp.route('/api/getPreferences', methods=['GET'])
def get_preferences():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM preferences")
    preferences = cursor.fetchall()
    cursor.close()
    return jsonify({'result': preferences})
    
