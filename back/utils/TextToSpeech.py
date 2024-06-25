import asyncio
import edge_tts
import pygame
import json
import sqlite3
import os

# Connexion à la base de données
db = sqlite3.connect("./db/database.db", check_same_thread=False)

# Liste des voix disponibles
VOICES = ['fr-FR-DeniseNeural', 'fr-FR-RemyMultilingualNeural', 'fr-FR-HenriNeural']

# Initialisation de pygame
pygame.mixer.init()

# Fonction pour obtenir une valeur de configuration depuis config.json
def get_config_value(key):
    try:
        with open("../config.json") as f:
            config = json.load(f)
        return config.get(key)
    except Exception as e:
        print(f"Erreur de lecture du fichier config.json : {e}")
        return None

# Fonction asynchrone pour convertir du texte en parole et sauvegarder en fichier audio


uuid = 0
async def amain(textToSpeak):
    global uuid
    try:
        cur = db.cursor()
        cur.execute("SELECT voice FROM preferences")
        result = cur.fetchone()
        cur.close()

        if result:
            voice_preference = result[0]
            if voice_preference == "Femme":
                print("FEMME")
                index = 0  # Utilisation de DeniseNeural pour la voix féminine
            else:
                print("HOMME")
                index = 2  # Utilisation de HenriNeural pour les autres voix masculines
        else:
            index = 2  # Voix par défaut si aucune préférence n'est trouvée

        VOICE = VOICES[index]
        print(VOICE)

        # Utilisation d'un chemin absolu pour le fichier audio
        audio_file_path = os.path.abspath("temp"+str(uuid)+".mp3")

        communicate = edge_tts.Communicate(textToSpeak, VOICE)
        await communicate.save(audio_file_path)
        print("Le fichier audio a été généré avec succès.")
    except Exception as e:
        print(f"Erreur lors de la génération du fichier audio : {e}")

# Fonction pour dire une instruction en utilisant la fonction saySomeWordInThread
def sayInstruction(textToSay):

    saySomeWordInThread(textToSay)

# Fonction pour dire quelques mots dans un thread
def saySomeWordInThread(string):
    global uuid
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(amain(string))
        finally:
            loop.close()

        audio_file_path = os.path.abspath("temp"+str(uuid)+".mp3")
        uuid+=1

        pygame.mixer.music.load(audio_file_path)
        pygame.mixer.music.play()
        cur = db.cursor()
        cur.execute("SELECT voice FROM muted")
        muted = cur.fetchone()
        if muted[0] == "on":
            pygame.mixer.music.set_volume(0)
        else:
            pygame.mixer.music.set_volume(1)

        cur.close()
        print("Lecture du fichier audio.")
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
        pygame.mixer.music.stop()
        print("Lecture terminée.")
  
        os.remove(os.path.abspath("temp"+str(uuid-1)+".mp3"))

        
        print(get_config_value('URL'))
    except RuntimeError as e:
        print(f"Erreur Runtime : {e}")
    except Exception as e:
        print(f"Erreur inattendue : {e}")


