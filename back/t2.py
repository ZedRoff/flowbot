import requests
from datetime import datetime, timedelta

# Remplacez 'YOUR_API_KEY' par votre clé API SNCF
API_KEY = ''
START_UIC_CODE = '87758342'  # Code UIC pour Noisy-Champs

END_UIC_CODE = '87758342 '     # Code UIC pour La Défense

def get_journey(start_uic_code, end_uic_code, arrival_time, api_key):
    arrival_time_str = arrival_time.strftime("%Y%m%dT%H%M%S")
    url = f'https://api.sncf.com/v1/coverage/sncf/journeys?from=stop_area:SNCF:{start_uic_code}&to=stop_area:SNCF:{end_uic_code}&arrival_date_time={arrival_time_str}'
    headers = {
        'Authorization': f'{api_key}'
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        journeys = data.get('journeys', [])
        return journeys
    else:
        print(f"Erreur: {response.status_code}")
        print(response.json())
        return None

def calculate_departure_time(arrival_time_str, start_uic_code, end_uic_code, api_key):
    arrival_time = datetime.strptime(arrival_time_str, "%H:%M:%S")
    now = datetime.now()
    arrival_date_time = now.replace(hour=arrival_time.hour, minute=arrival_time.minute, second=arrival_time.second)

    journeys = get_journey(start_uic_code, end_uic_code, arrival_date_time, api_key)
    if journeys:
        best_journey = journeys[0]  # Suppose le premier est le meilleur
        departure_time_str = best_journey['departure_date_time']
        departure_time = datetime.strptime(departure_time_str, "%Y%m%dT%H%M%S")
        
        print(f"Pour arriver à {arrival_time_str} à la station destination, vous devez partir à {departure_time.strftime('%H:%M:%S')} de la station de départ.")
    else:
        print("Aucun trajet trouvé.")

if __name__ == "__main__":
    arrival_time_str = "17:30:00"  # Exemple d'heure d'arrivée souhaitée
    calculate_departure_time(arrival_time_str, START_UIC_CODE, END_UIC_CODE, API_KEY)
