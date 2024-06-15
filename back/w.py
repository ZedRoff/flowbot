import os
import subprocess
import pdfkit
from PIL import Image

def check_tool_installed(tool_name):
    """Vérifie si un outil est installé en utilisant la commande 'where' sous Windows."""
    result = subprocess.run(['where', tool_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return result.returncode == 0

def convert_to_pdf(input_file, output_file):
    file_ext = os.path.splitext(input_file)[1].lower()

    if file_ext in ['.html', '.htm']:
        if not check_tool_installed('wkhtmltopdf'):
            raise EnvironmentError("wkhtmltopdf n'est pas installé ou non trouvé dans le PATH.")
        pdfkit.from_file(input_file, output_file)
    elif file_ext in ['.jpg', '.jpeg', '.png', '.bmp', '.gif']:
        image = Image.open(input_file)
        image.convert('RGB').save(output_file, 'PDF')
    elif file_ext in ['.pdf']:
        # Si le fichier est déjà un PDF, nous copions simplement le fichier
        os.system(f'copy {input_file} {output_file}')
    else:
        if not check_tool_installed('unoconv'):
            raise EnvironmentError("unoconv n'est pas installé ou non trouvé dans le PATH.")
        # Utiliser unoconv pour d'autres types de fichiers (doc, docx, xls, xlsx, etc.)
        subprocess.run(['unoconv', '-f', 'pdf', '-o', output_file, input_file])

def main():
    input_path = 'chemin_vers_votre_fichier'
    output_path = 'chemin_vers_sortie_fichier.pdf'
    try:
        convert_to_pdf(input_path, output_path)
        print(f'Le fichier {input_path} a été converti en {output_path}')
    except EnvironmentError as e:
        print(e)
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")

if __name__ == '__main__':
    main()