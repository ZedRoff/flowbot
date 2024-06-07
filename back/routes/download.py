from flask import send_file, Blueprint, jsonify, request
import os
from flask_socketio import SocketIO, emit


bp = Blueprint('download', __name__)


@bp.route('/api/download', methods=['POST'])
def download_file():
    if request.method == 'POST':
      
        if 'file' not in request.files:
            return 'No file part'
        

        file = request.files['file']
        if file.filename == '':
            return 'No selected file'
        
        filename = "uploads/{}/{}".format(request.form['folder'], file.filename)
        print(filename)
        file.save(filename)
        emit('message', {"from": "back", "type": "files_update"}, broadcast=True, namespace='/')
        return 'File uploaded successfully'

    return jsonify({'message': 'ok'})