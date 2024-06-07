import requests


API_KEY = ''

def get_trains_departures(station_code):
    url = f"https://api.sncf.com/v1/coverage/sncf/stop_areas/{station_code}/departures"
    headers = {"Authorization": API_KEY}  # Replace YOUR_API_KEY with your actual API key

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        departures = response.json()
        return departures
    else:
        print(f"Error {response.status_code} occurred.")
        return None

def main():
    station_code = input("Enter the station code: ")
    departures = get_trains_departures(station_code)

    if departures:
        print("Trains departing from the station:")
        for departure in departures["departures"]:
            print(departure["display_informations"]["direction"])

if __name__ == "__main__":
    main()
