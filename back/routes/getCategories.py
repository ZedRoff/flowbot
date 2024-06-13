from flask import Blueprint
import sqlite3
from flask import request, jsonify

bp = Blueprint('get_categories', __name__)

con = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/getCategories', methods=['GET'])
def get_categories():
    if request.method == 'GET':
        cur = con.cursor()
        cur.execute("SELECT * FROM categories")
        categories = cur.fetchall()
        cur.close()
        response = jsonify({'result': categories})
        return response
    
    
        
    

