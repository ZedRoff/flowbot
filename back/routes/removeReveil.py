
import feedparser



from flask import Blueprint, request, jsonify
import sqlite3
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_reveil', __name__)

@bp.route('/api/removeReveil', methods=['POST'])
def remove_reveil():
    if request.method == 'POST':
        try:
            data = request.get_json()
            time = data['time']
            cursor = con.cursor()
            # check if the time exists
            cursor.execute('SELECT * FROM reveil WHERE time = ?', (time,))
            if not cursor.fetchone():
                return jsonify({'result': 'not_found'})
            
            cursor.execute('DELETE FROM reveil WHERE time = ?', (time,))
            con.commit()
            cursor.close()
            
            return jsonify({'result': 'success'})
        except Exception as e:
            return jsonify({'error': str(e)})
        
        
