from flask import Blueprint, request, jsonify

import os
bp = Blueprint('get_enregistrements', __name__)


@bp.route('/api/getEnregistrements', methods=['GET'])
def get_enregistrements():
    try:
        if request.method == 'GET':
            enregistrements_dir = "./uploads/enregistrements"
            files = os.listdir(enregistrements_dir)
            return jsonify({'result': files})
    except Exception as e:
        return jsonify({'error': str(e)})
    return jsonify({'error': 'Method not allowed'})
           
            