



import os
import PyPDF2  
from flask import Blueprint
from flask import request, jsonify
bp = Blueprint('file_info', __name__)


def extract_text_from_file(file_path):
    file_extension = os.path.splitext(file_path)[1].lower()

    if file_extension == '.pdf':
        return extract_text_from_pdf(file_path)
    else:
        return extract_text_from_plain_text(file_path)

def extract_text_from_plain_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text




def extract_text_from_pdf(file_path):
    text = ''
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text


def nbWords(text):
    return len(text.split())

def nbChars(text):
    return len(text)

def nbSentences(text):
    return len(text.split('.'))

def time_to_read(text):
    return [nbWords(text) / 100,   nbWords(text) * 3.8 / 500, nbWords(text) * 0.6 / 100]
def time_format(time):
    return f"{int(time)} minutes et {int((time - int(time)) * 60)} secondes"



@bp.route('/api/fileInfo', methods=['POST'])
def file_info():
    data = request.get_json()
    file_path = data['file_path']
   
    extracted_text = extract_text_from_file(file_path)
    print("text : {}".format(extracted_text))
    return jsonify({'nbWords': nbWords(extracted_text), 'nbChars': nbChars(extracted_text), 'nbSentences': nbSentences(extracted_text), 'timeToRead': time_to_read(extracted_text), 'timeFormat': [time_format(time_to_read(extracted_text)[0]), time_format(time_to_read(extracted_text)[1]), time_format(time_to_read(extracted_text)[2])]})
