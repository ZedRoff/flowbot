import requests
from bs4 import BeautifulSoup

def recherche_wikipedia(sujet):
    # Formater le sujet pour l'URL de Wikipédia
    sujet_formatte = sujet.replace(' ', '_')
    url = f"https://fr.wikipedia.org/wiki/{sujet_formatte}"
    
    # Faire une requête HTTP pour obtenir le contenu de la page
    response = requests.get(url)
    
    if response.status_code == 200:
        # Parser le contenu HTML de la page
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extraire le titre de la page
        titre = soup.find('h1', {'id': 'firstHeading'}).text
        
        # Extraire le premier paragraphe de la page
        paragraphe = soup.find('div', {'class': 'mw-parser-output'}).find_all('p')[0].text
        
        return {
            'titre': titre,
            'introduction': paragraphe
        }
    else:
        return None

# Exemple d'utilisation
sujet = "Marie Curie"
resultat = recherche_wikipedia(sujet)

if resultat:
    print(f"Titre: {resultat['titre']}\n")
    print(f"Introduction: {resultat['introduction']}\n")
else:
    print("La page n'a pas été trouvée.")
