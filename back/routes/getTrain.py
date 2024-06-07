


import requests
import json
from datetime import datetime

import requests
from flask import Blueprint, request, jsonify


API_KEY = ''

VAL_DE_FONTENAY = 'SNCF:87758342'

def get_uic_code(station_name):
    url = f'https://api.sncf.com/v1/coverage/sncf/stop_areas?q={station_name}'
    headers = {
        'Authorization' : f'{API_KEY}'
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        stop_areas = data['stop_areas']
        if stop_areas:
            return stop_areas[0]['codes'][0]['value']
        else:
            print("Aucune station trouvée.")
            return None
    else:
        print(f"Erreur: {response.status_code}")
        print(response.json())
        return None



def get_next_train(station_name):
    station_uic_code = get_uic_code(station_name)
    print(station_uic_code)
    url = f'https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area:{VAL_DE_FONTENAY}/departures?datetime=20240605T124848'
    headers = {
        'Authorization': f'{API_KEY}'
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        departures = data['departures']
        return departures
    else:
        print(f"Erreur: {response.status_code}")
        print(response.json())



bp = Blueprint('get_train', __name__)

@bp.route('/api/getTrain', methods=['GET'])
def get_train():
    if request.method == 'GET':
        departures = get_next_train("TEMPO")
        if departures:
            tab = []
            for departure in departures:
                train = departure['display_informations']
                destination = train['direction']
                message = departure['stop_date_time']['departure_date_time']
                
                d = {}
                date_obj = datetime.strptime(message, "%Y%m%dT%H%M%S")

            
                iso_date_str = date_obj.isoformat()
                d['destination'] = destination
                d['departure_time'] = iso_date_str
                tab.append(d)
            return jsonify({'result': 'success', 'departures' : tab, 'type': 'RER A'})
    

