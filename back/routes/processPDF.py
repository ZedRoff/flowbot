from flask import Blueprint, jsonify, send_from_directory, request
import os

bp = Blueprint('process_pdf', __name__)

@bp.route('/api/processPDF', methods=['POST'])
def process_pdf():
    print("CAPTERR")
    data = request.get_json()
    if not data or 'pdf_name' not in data:
        return jsonify({'error': 'No PDF name provided'}), 400
    pdf_name = data['pdf_name']
    uploads_directory = 'uploads/PDF'
    pdf_files = [file for file in os.listdir(uploads_directory) if file.endswith('.pdf')]
    if pdf_name in pdf_files:
        return send_from_directory(uploads_directory, pdf_name)
    else:
        return jsonify({'error': 'PDF file not found in the directory'}), 404
