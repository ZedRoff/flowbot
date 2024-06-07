from flask import Blueprint, jsonify, send_from_directory
import os

bp = Blueprint('get_pdfs', __name__)
@bp.route('/api/getPDFs', methods=['GET'])
def get_pdf():
    uploads_directory = 'uploads/PDF'
    pdf_files = [file for file in os.listdir(uploads_directory) if file.endswith('.pdf')]
    if pdf_files:
        return jsonify({'pdf_files': pdf_files})
    else:
        return jsonify({'error': 'No PDF files found in the directory'}), 404
