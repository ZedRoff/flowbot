from flask import Blueprint, request, jsonify
import time

bp = Blueprint('minuteur', __name__)

# Variables globales pour stocker l'état du minuteur
temps_initial = 0
temps_restant = 0
debut = None
en_cours = False
paused = False

@bp.route('/api/startMinuteur', methods=['POST'])
def start_minuteur():
    global temps_initial
    if request.method == 'POST':
        temps = request.get_json()['temps']
        temps_initial = temps
        demarrer(temps)
        return "Minuteur démarré avec succès."

@bp.route('/api/getMinuteur', methods=['GET'])
def get_temps():
    if request.method == 'GET':
        temps = obtenir_temps()
        return jsonify({'temps': temps})

@bp.route('/api/pauseMinuteur', methods=['GET'])
def pause_minuteur():
    if request.method == 'GET':
        mettre_en_pause()
        return "Minuteur mis en pause avec succès."

@bp.route('/api/stopMinuteur', methods=['GET'])
def stop_minuteur():
    if request.method == 'GET':
        arreter()
        return "Minuteur arrêté avec succès."

@bp.route('/api/continueMinuteur', methods=['GET'])
def continue_minuteur():
    if request.method == 'GET':
        reprendre()
        return "Minuteur continué avec succès."

def demarrer(secondes):
    global debut, en_cours, temps_restant, paused
    if not en_cours:
        temps_restant = secondes
        debut = time.time()
        en_cours = True
        paused = False
        print(f'Minuteur démarré pour {secondes} secondes.')
    else:
        print("Le minuteur est déjà en cours.")

def obtenir_temps():
    global debut, temps_restant
    if en_cours and not paused:
        temps_ecoule = time.time() - debut
        temps_actuel = max(0, temps_restant - temps_ecoule)
        return temps_actuel
    else:
        return temps_restant

def mettre_en_pause():
    global debut, temps_restant, en_cours, paused
    if en_cours and not paused:
        temps_restant -= time.time() - debut
        paused = True
        en_cours = False
        print(f'Minuteur mis en pause. Temps restant: {temps_restant} secondes')
    else:
        print("Le minuteur n'est pas en cours ou est déjà en pause.")

def arreter():
    global debut, temps_restant, en_cours, paused
    debut = None
    temps_restant = 0
    en_cours = False
    paused = False
    print("Minuteur arrêté et réinitialisé.")

def reprendre():
    global debut, en_cours, paused
    if not en_cours and paused:
        debut = time.time()
        en_cours = True
        paused = False
        print("Minuteur repris.")
    else:
        print("Le minuteur est déjà en cours ou n'est pas en pause.")

