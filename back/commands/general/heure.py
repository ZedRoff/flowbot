
import re
import datetime
import pytz
from utils.CommandMaker import CommandMaker

COUNTRY_MAPPING = {
    "france": "Europe/Paris",
    "allemagne": "Europe/Berlin",
    "états-unis": "America/New_York"
}

class Command(CommandMaker):
    def command(self):
        super().sayInstruction("Donnez un pays")
    def specificity(self, param):
        country = self.get_pytz_country(param)
        if country:
            country_time = self.get_country_time(country)
            super().sayInstruction("Il est " + country_time + " à " + param)
            super().resetAction()
        else:
            super().sayInstruction("Pays non pris en charge")
    def trigger(self, pText):
        return ((re.search("quelle", pText) or re.search("donne", pText)) and re.search("heure", pText))
    def get_pytz_country(self, country):
        return COUNTRY_MAPPING.get(country)
    def get_country_time(self, country):
        country_timezone = pytz.timezone(country)
        current_time = datetime.datetime.now(country_timezone).strftime("%I:%M %p")
        return current_time
    def isSpecific(self):
        return True