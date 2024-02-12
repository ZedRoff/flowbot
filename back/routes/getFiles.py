from flask import  Blueprint, jsonify
import os

bp = Blueprint('get_files', __name__)


@bp.route('/api/getFiles', methods=['GET'])
def get_files():
    
    files = os.listdir('uploads')
    return jsonify({'files': files})