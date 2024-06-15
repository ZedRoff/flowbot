



from flask import Blueprint, request, jsonify
from flask_socketio import emit
import os
import sqlite3
import requests

bp = Blueprint('correct_text', __name__)
db = sqlite3.connect("./db/database.db", check_same_thread=False)

@bp.route('/api/correctText', methods=['POST'])
def correct_text():
    data = request.get_json()
    url = 'https://languagetool.org/api/v2/check'
    text = data['text']
    lang = data['lang']
    data = {'text': text, "language": lang}
    response = requests.post(url, data=data)
    matches = response.json()['matches']
    corrected_text = text
    corrections = {} 
    offset = 0
    for match in matches:
        if match['replacements']:
            start = match['offset'] + offset
            end = start + match['length']
            incorrect_word = text[start:end]
            replacement = match['replacements'][0]['value']
            corrected_text = corrected_text[:start] + replacement + corrected_text[end:]
            offset += len(replacement) - match['length']
            corrections[incorrect_word] = replacement
    return jsonify({'corrected_text': corrected_text, 'corrections': corrections})
    