from flask import send_file, Blueprint, jsonify, request
import os
from flask_socketio import SocketIO, emit


bp = Blueprint('delete_folder', __name__)


@bp.route('/api/deleteFolder', methods=['POST'])
def delete_folder():
    if request.method == 'POST':

        folder = request.get_json()['folder']
        if folder == "enregistrements" or folder == "PDF" or folder == "info":
            return jsonify({"result": "reserved"})
        os.rmdir(f'uploads/{folder}')
        emit('message', {"from": "back", "type": "files_update"}, broadcast=True, namespace='/')
        return jsonify({"result": "success"})