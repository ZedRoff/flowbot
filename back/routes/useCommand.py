from flask import Blueprint, request, jsonify
from utils.ActionsFromText import executeAction
bp = Blueprint('use_command', __name__)

@bp.route('/api/useCommand', methods=['POST'])
def use_command():
    if request.method == "POST":
        data = request.get_json()
        executeAction(data["message"])
        if len(data["message"]) == 0 or data["message"] == None:
            return jsonify({"result": "error"})
        
        return jsonify({"result": "success"})


