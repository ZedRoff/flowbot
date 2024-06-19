from flask import Blueprint, request, jsonify
import sqlite3
import time

bp = Blueprint('chronometre', __name__)

debut = None
temps_total = 0
en_cours = False

@bp.route('/api/startChronometre', methods=['GET'])
def start_chronometre():
    if request.method == 'GET':
        if en_cours:
            return jsonify({'result': 'error'})
        demarrer()
        return jsonify({'result': 'success'})

@bp.route('/api/getTemps', methods=['GET'])
def get_temps():
    if request.method == 'GET':
        temps = obtenir_temps()
        return jsonify({'temps': temps})

@bp.route('/api/pauseChronometre', methods=['GET'])
def pause_chronometre():
    if request.method == 'GET':
        if not en_cours:
            return jsonify({'result': 'error'})
        mettre_en_pause()
        return jsonify({'result': 'success'})

@bp.route('/api/stopChronometre', methods=['GET'])
def stop_chronometre():
    if request.method == 'GET':
        if not en_cours:
            return jsonify({'result': 'error'})
        arreter()
        return jsonify({'result': 'success'})
@bp.route('/api/continueChronometre', methods=['GET'])
def continue_chronometre():
    if request.method == 'GET':
        if en_cours:
            return jsonify({'result': 'error'})
        demarrer()
        return jsonify({'result': 'success'})
    

# Variables globales pour stocker l'état du chronomètre

def demarrer():
    global debut, en_cours
    if not en_cours:
        debut = time.time()
        en_cours = True
    else:
        print("Le chronomètre est déjà en cours.")

def obtenir_temps():
    if en_cours:
        return temps_total + (time.time() - debut)
    else:
        return temps_total

def mettre_en_pause():
    global debut, temps_total, en_cours
    if en_cours:
        temps_total += time.time() - debut
        en_cours = False
    else:
        print("Le chronomètre n'est pas en cours.")

def arreter():
    global debut, temps_total, en_cours
    debut = None
    temps_total = 0
    en_cours = False
