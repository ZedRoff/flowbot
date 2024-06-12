
from flask_socketio import SocketIO, emit
from flask import Blueprint, request, jsonify
import sqlite3
import os
con = sqlite3.connect("./db/database.db", check_same_thread=False)
bp = Blueprint('remove_file', __name__)

@bp.route('/api/removeFile', methods=['POST'])
def removeFile():
    if request.method == 'POST':
        try:
            data = request.get_json()
          
            file_name = data['file_name']
            folder_name = data['folder_name']
          
                        # Check if the file exists
            if not os.path.exists(f"./uploads/{folder_name}/{file_name}"):
                return jsonify({'result': 'doesnt'})
            # Remove the file

            
            os.remove(f"./uploads/{folder_name}/{file_name}")
            response = jsonify({'result': 'success'})
            emit('message', {"from": "back", "type": "files_update"}, broadcast=True, namespace='/')
            return response
        
            
        except Exception as e:
            return jsonify({'error': str(e)})
        
        
