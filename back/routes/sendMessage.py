from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit
bp = Blueprint('send_message', __name__)

@bp.route('/api/send_message', methods=['POST'])

def send_message():
    if request.method == "POST":
        data = request.get_json()
        emit('message', data, broadcast=True, namespace=('/') )
        print("passage")
        return jsonify({'result': "success"})