


import requests
import json
from datetime import datetime

import requests
from flask import Blueprint, request, jsonify
import os 
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ["API_TRAIN"]


def get_station_code(station_name):
    url = f"https://api.sncf.com/v1/coverage/sncf/places?q={station_name}&type%5B%5D=stop_area"
    headers = {"Authorization": f"{API_KEY}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        places = response.json()["places"]
        if places:
            return places[0]["stop_area"]["id"]
        else:
            print(f"Station '{station_name}' not found.")
            return None
    else:
        print(f"Error {response.status_code} occurred.")
        return None



def get_trains_departures(station_code):
    url = f"https://api.sncf.com/v1/coverage/sncf/stop_areas/{station_code}/departures"
    headers = {"Authorization": f"{API_KEY}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        departures = response.json()
        return departures
    else:
        print(f"Error {response.status_code} occurred.")
        return None

def calculate_time_until_departure(departure_time):
    departure_datetime = datetime.strptime(departure_time, "%Y%m%dT%H%M%S")

    current_datetime = datetime.now()
    time_until_departure = departure_datetime - current_datetime

    minutes_until_departure = int(time_until_departure.total_seconds() / 60)
    return minutes_until_departure


bp = Blueprint('get_train', __name__)

@bp.route('/api/getTrain', methods=['POST'])
def get_train():
    if request.method == 'POST':
        data = request.get_json()
        station_name = data["location"]

        station_code = get_station_code(station_name)

        if station_code:
            departures = get_trains_departures(station_code)

        if departures and "departures" in departures:
            print(f"Trains departing from {station_name}:")
            deps = []
            for departure in departures["departures"]:
                direction = departure["display_informations"]["direction"]
                departure_time = departure["stop_date_time"]["departure_date_time"]
                minutes_until_departure = calculate_time_until_departure(departure_time)
                deps.append({"direction": direction, "time": minutes_until_departure})
            return jsonify({'result': deps})
        else:
            return f"No train departures found for {station_name}."
    else:
        return "Invalid request method."




