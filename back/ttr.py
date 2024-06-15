



import os
import PyPDF2  

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
    return [ nbWords(text) / 100,   nbWords(text) * 3.8 / 500, nbWords(text) * 0.6 / 100]
def time_format(time):
    return f"{int(time)} minutes et {int((time - int(time)) * 60)} secondes"


# Exemple d'utilisation :
if __name__ == "__main__":
    file_path = 'sample.pdf'  # Modifier avec votre chemin de fichier
    extracted_text = extract_text_from_file(file_path)
    print(f"Nombre de mots : {nbWords(extracted_text)}")
    print(f"Nombre de caractères : {nbChars(extracted_text)}")
    print(f"Nombre de phrases : {nbSentences(extracted_text)}")
    print(f"Temps de lecture (lent, normal, rapide) : {time_to_read(extracted_text)}")
    print(f"Temps de lecture (lent, normal, rapide) : {time_format(time_to_read(extracted_text)[0])}")
    print(f"Temps de lecture (lent, normal, rapide) : {time_format(time_to_read(extracted_text)[1])}")
    print(f"Temps de lecture (lent, normal, rapide) : {time_format(time_to_read(extracted_text)[2])}")
    

'''
"

text = "On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y rajouter de petits clins d'oeil, voire des phrases embarassantes)."

print(f"Slow : {time_format(time_to_read(text)[0])}\nNormal : {time_format(time_to_read(text)[1])}\nFast : {time_format(time_to_read(text)[2])}")'''