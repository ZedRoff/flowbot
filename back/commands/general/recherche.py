from googlesearch import search
import requests
from bs4 import BeautifulSoup
import re
from utils.TextToSpeech import sayInstruction
from utils.ResetAction import resetAction
in_specificity = False

def command():
    sayInstruction("Ok, quelle recherche ?")
def getInSpecificity():
    return in_specificity
def specificity(param):
    global in_specificity
    query = param
    num_results = 1  

    search_results = search(query, num_results=num_results)
    first_result_url = next(search_results)

    response = requests.get(first_result_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    paragraphs = soup.find_all('p')

    try:
            
            first_paragraph = paragraphs[0].text.split('.')[0:3]
            print(first_paragraph)
            res = ""
            for f in first_paragraph:
                res += f
            sayInstruction(f)
            resetAction()
            in_specificity = False

    except Exception as e:
        sayInstruction("Je n'ai rien trouvé à ce sujet")
def trigger(pText):
    return (re.search("fais", pText)) and (re.search("recherche", pText))   