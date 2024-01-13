from utils.TextToSpeech import sayInstruction
import re
import datetime
import pytz
from utils.ResetAction import resetAction

COUNTRY_MAPPING = {
    "france": "Europe/Paris",
    "allemagne": "Europe/Berlin",
    "états-unis": "America/New_York"
}
in_specificity = False
def command():
    sayInstruction("Donnez un pays")

def specificity(param):
    global in_specificity
    country = get_pytz_country(param)
    if country:
        country_time = get_country_time(country)
        sayInstruction("Il est " + country_time + " à " + param)
        resetAction()
        in_specificity = False

    else:
        sayInstruction("Pays non pris en charge")

def getInSpecificity():
    return False
def get_pytz_country(country):
    return COUNTRY_MAPPING.get(country)
def get_country_time(country):
    country_timezone = pytz.timezone(country)
    current_time = datetime.datetime.now(country_timezone).strftime("%I:%M %p")
    return current_time

def trigger(pText):
    return ((re.search("quelle", pText) or re.search("donne", pText)) and re.search("heure", pText))
