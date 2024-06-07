

from flask import Blueprint, request, jsonify
from flask_socketio import emit
import os

bp = Blueprint('create_folder', __name__)


@bp.route('/api/createFolder', methods=['POST'])
def create_folder():
    data = request.get_json()
    if not data or 'folder_name' not in data:
        return jsonify({'error': 'No folder name provided'}), 400

    folder_name = data['folder_name']
    base_path = './uploads'
    folder_path = os.path.join(base_path, folder_name)
    try:
        os.makedirs(folder_path, exist_ok=True)
        emit('message', {"from": "back", "type": "files_update"}, broadcast=True, namespace='/')
        return jsonify({'message': f'Folder "{folder_name}" created successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500