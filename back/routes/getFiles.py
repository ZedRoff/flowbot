from flask import  Blueprint, jsonify
import os

bp = Blueprint('get_files', __name__)


@bp.route('/api/getFiles', methods=['GET'])
def get_files():
    payload = []
    base_path = './uploads'
    folders = [folder for folder in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, folder))]
    print(folders)
    for folder in folders:
        files = os.listdir(f'./uploads/{folder}')
        payload.append({'folder': folder, 'files': files})

    return jsonify({'result': payload})