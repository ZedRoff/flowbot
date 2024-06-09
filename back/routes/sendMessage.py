from flask import Blueprint, request, jsonify
<<<<<<< HEAD

from flask_socketio import SocketIO, emit

bp = Blueprint('send_message', __name__)

@bp.route('/api/send_message', methods=['POST'])
def send_message():
    
    if request.method == 'POST':
        data = request.get_json()
        emit('message', data, broadcast=True, namespace='/')















           
=======
from flask_socketio import SocketIO, emit
bp = Blueprint('send_message', __name__)

@bp.route('/api/send_message', methods=['POST'])

def send_message():
    if request.method == "POST":
        data = request.get_json()
        emit('message', data, broadcast=True, namespace=('/') )
        print("passage")
        return jsonify({'result': "success"})
>>>>>>> a7b398a99350b4cf6c4ae5dc9e193674250b507f
