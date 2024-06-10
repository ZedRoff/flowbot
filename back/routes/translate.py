
from deep_translator import GoogleTranslator


from flask import Blueprint, request, jsonify

from flask_socketio import emit


bp = Blueprint('translate', __name__)

@bp.route('/api/translate', methods=['POST'])
def talk():
    if request.method == 'POST':
        data = request.get_json()
        text = data['text']
        lang = data['language']

        translated = GoogleTranslator(source='auto', target=lang).translate(text)
    
        emit('message', {"from": "back", "message": "translation", "type": "translation", "initialText": text, "translatedText": translated}, broadcast=True, namespace='/')
        return jsonify({'result': 'success'})
