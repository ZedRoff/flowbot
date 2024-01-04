from flask_socketio import emit

def emit_message(message):
    emit('message', message, broadcast=True, namespace='/') # TODO : check if namespace is needed
