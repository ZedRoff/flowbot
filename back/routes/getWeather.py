import requests
from flask import Blueprint, request, jsonify
from datetime import datetime

def get_weather(city_name):
    geocode_url = f"https://nominatim.openstreetmap.org/search?city={city_name}&format=json"
    geocode_response = requests.get(geocode_url)
    geocode_data = geocode_response.json()

    if geocode_data:
        latitude = geocode_data[0]['lat']
        longitude = geocode_data[0]['lon']
        
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
        weather_response = requests.get(weather_url)
        weather_data = weather_response.json()
        
        if 'current_weather' in weather_data:
            current_weather = weather_data['current_weather']
            weather_info = {
                "City": city_name,
                "Temperature": current_weather["temperature"],
                "Windspeed": current_weather["windspeed"],
                "Wind Direction": current_weather["winddirection"],
                "Weather Code": current_weather["weathercode"]
            }
            return weather_info
        else:
            return f"Weather information for {city_name} is not available."
    else:
        return f"City {city_name} not found."




temperature_ressenti = {
    "Très froid": range(-50, 0),     # -50 à -1 degrés Celsius
    "Froid": range(0, 10),           # 0 à 9 degrés Celsius
    "Frais": range(10, 20),          # 10 à 19 degrés Celsius
    "Doux": range(20, 25),           # 20 à 24 degrés Celsius
    "Chaud": range(25, 30),          # 25 à 29 degrés Celsius
    "Très chaud": range(30, 35),     # 30 à 34 degrés Celsius
    "Canicule": range(35, 50)        # 35 à 49 degrés Celsius
}

def obtenir_ressenti_temperature(temperature):
    for ressenti, plage in temperature_ressenti.items():
        if temperature in plage:
            return ressenti
    return "Extrême"  # Pour les températures hors des plages définies




bp = Blueprint('get_weather', __name__)

@bp.route('/api/getWeather', methods=['POST'])
def g_w():
    if request.method == 'POST':
        data = request.get_json()
        city_name = data["location"]
        weather_info = get_weather(city_name)
        infos = {}
        # get today's day
        

        jour_semaine_fr = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][datetime.now().weekday()]
        infos["day"] = jour_semaine_fr
        if isinstance(weather_info, dict):
            for key, value in weather_info.items():
                if key == "Temperature":
                    infos["ressenti"] = obtenir_ressenti_temperature(value)
                infos[key] = value
                
        else:
            return jsonify({'result': weather_info})
        return jsonify({'result': infos})

    

