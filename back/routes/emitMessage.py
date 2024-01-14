from flask import Blueprint
from flask_socketio import emit
from flask import request, jsonify
bp = Blueprint('emit_message', __name__)

@bp.route('/api/emitMessage', methods=['POST'])
def emit_message():
    
    data = request.get_json()
    message = data["message"]
    command = data["command"]
    
    emit('message', {'message': message, 'command': command}, broadcast=True, namespace='/')
    return jsonify({'result': 'success'})
