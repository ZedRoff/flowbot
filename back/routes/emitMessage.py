from flask import request, Blueprint
from flask_socketio import emit

bp = Blueprint('emit_message', __name__)

@bp.route('/api/emitMessage', methods=['POST'])
def emit_message():
    message = request.json.get('message')
    emit('message', {'message': message}, broadcast=True)
    return 'Message emitted successfully'
