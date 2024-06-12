import requests
import json

def get_distance_and_duration(origin, destination, mode="driving", api_key="YOUR_API_KEY"):
    base_url = "https://maps.googleapis.com/maps/api/distancematrix/json"

    params = {
        "origins": origin,
        "destinations": destination,
        "mode": mode,
        "key": api_key
    }

    response = requests.get(base_url, params=params)
    data = response.json()

    if data['status'] == 'OK':
        elements = data['rows'][0]['elements'][0]
        distance = elements['distance']['text']
        duration = elements['duration']['text']
        return distance, duration
    else:
        return None, None

if __name__ == "__main__":
    origin = "Place de la Concorde, Paris, France"
    destination = "Eiffel Tower, Paris, France"
    api_key = "YOUR_API_KEY"

    distance, duration = get_distance_and_duration(origin, destination, api_key=api_key)

    if distance and duration:
        print(f"Distance: {distance}")
        print(f"Duration: {duration}")
    else:
        print("Error: Unable to fetch distance and duration.")