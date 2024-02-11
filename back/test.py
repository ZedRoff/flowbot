
from deep_translator import GoogleTranslator


translated = GoogleTranslator(source='auto', target="en").translate("bonjour, ceci est un test")

print(translated)