import requests

def correct_text(text, lang):
    url = 'https://languagetool.org/api/v2/check'
    data = {'text': text, 'language': lang}
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
    return corrected_text, corrections

text = "Il aiment les pommes et les poires."

# Correction du texte
corrected_text, corrections = correct_text(text, 'fr-FR')

print("Texte corrigé :\n", corrected_text)

print("\nCorrections :")
for incorrect_word, replacement in corrections.items():
    print(f"{incorrect_word} -> {replacement}")