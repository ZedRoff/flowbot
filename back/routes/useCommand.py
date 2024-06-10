from flask import Blueprint, request, jsonify
from utils.ActionsFromText import execute_action

bp = Blueprint('use_command', __name__)

@bp.route('/api/useCommand', methods=['POST'])
def use_command():
    if request.method == "POST":
        data = request.get_json()
        message = data.get("message", "")
    
        if not message:
            return jsonify({"result": "error"})
    
        execute_action(message)
        return jsonify({"result": "success"})
