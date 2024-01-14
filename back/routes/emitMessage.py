from flask import Blueprint
from flask_socketio import emit
from flask import request, jsonify
bp = Blueprint('emit_message', __name__)

@bp.route('/api/emitMessage', methods=['POST'])
def emit_message():
    
    data = request.get_json()
    print(data)
    message = data["message"]
    
    emit('message', {'message': message}, broadcast=True, namespace='/')
    return jsonify({'result': 'success'})
