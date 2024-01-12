from flask import Blueprint, request, jsonify
import threading
from utils.TextToSpeech import sayInstruction
bp = Blueprint('talk', __name__)

@bp.route('/api/talk', methods=['POST'])
def talk():
    if request.method == 'POST':
        data = request.get_json()
        textToSay = data['textToSay']
        instruction_thread = threading.Thread(target=sayInstruction, args=(textToSay,))
        instruction_thread.start()
        response = jsonify({'result': 'success'})
        return response
