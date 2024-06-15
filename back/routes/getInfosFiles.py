from flask import  Blueprint, jsonify
import os

bp = Blueprint('get_infos_files', __name__)


@bp.route('/api/getInfosFiles', methods=['GET'])
def get_infos_files():
    # get the files inside ./uploads/info folder
    payload = []
    base_path = './uploads/info'
    files = os.listdir(base_path)
    for file in files:
        payload.append({'file': file})

    return jsonify({'result': payload})
