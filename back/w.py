from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def convert_docx_to_pdf(input_docx_file, output_pdf_file):
    doc = Document(input_docx_file)
    c = canvas.Canvas(output_pdf_file, pagesize=letter)

    for para in doc.paragraphs:
        c.drawString(100, 700, para.text)
        c.showPage()

    c.save()

# Utilisation
input_docx_file = "f.docx"
output_pdf_file = "output.pdf"
convert_docx_to_pdf(input_docx_file, output_pdf_file)