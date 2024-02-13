from flask import send_file, Blueprint, jsonify, request
import os

bp = Blueprint('download', __name__)


@bp.route('/api/download', methods=['POST'])
def download_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part'

        file = request.files['file']
        if file.filename == '':
            return 'No selected file'
        print(file.name)
        filename = os.path.join('uploads', file.filename)
        file.save(filename)
        return 'File uploaded successfully'

    return jsonify({'message': 'ok'})