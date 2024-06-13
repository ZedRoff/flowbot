from flask import Blueprint, request, jsonify
import sqlite3

bp = Blueprint('get_tasks', __name__)

def get_db_connection():
    return sqlite3.connect("./db/database.db")

@bp.route('/api/getTasks', methods=['POST'])
def get_tasks():
    if request.method == 'POST':
        data = request.get_json()
        category_name = data.get('category')

        if not category_name:
            return jsonify({'result': 'categorynotprovided'}), 400

        try:
            con = get_db_connection()
            cur = con.cursor()

            cur.execute("SELECT * FROM categories WHERE name = ?", (category_name,))
            category = cur.fetchone()

            if category is None:
                return jsonify({'result': 'categorydoesnotexist'}), 404

            category_name = category[0]
            cur.execute("SELECT name, status FROM tasks WHERE category = ?", (category_name,))
            tasks = cur.fetchall()

            tasks_list = [{'name': task[0], 'status': task[1]} for task in tasks]

            return jsonify({'result': tasks_list})

        except sqlite3.Error as e:
            return jsonify({'error': str(e)}), 500

        finally:
            if con:
                con.close()
