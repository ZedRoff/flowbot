from flask import Blueprint, request, jsonify
from utils.ActionsFromText import executeAction

bp = Blueprint('use_command', __name__)

@bp.route('/api/useCommand', methods=['POST'])
def use_command():
    data = request.get_json()
    message = data.get("message", "")
    
    if not message:
        return jsonify({"result": "error"})
    
    executeAction(message)
    return jsonify({"result": "success"})
