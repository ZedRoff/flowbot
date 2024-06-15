import requests
from bs4 import BeautifulSoup

def recherche_google(query):
    url = f"https://www.google.com/search?q={'+'.join(query.split())}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []
        for g in soup.find_all('div', class_='rc'):
            link = g.find('a')['href']
            title = g.find('h3').text
            snippet = g.find('span', class_='aCOpRe').text if g.find('span', class_='aCOpRe') else ''
            results.append({'title': title, 'link': link, 'snippet': snippet})
        return results
    else:
        print("Erreur lors de la requête")

# Exemple d'utilisation
query = input("Entrez votre recherche : ")
results = recherche_google(query)
if results:
    for i, result in enumerate(results, start=1):
        print(f"Résultat {i}:")
        print(f"Titre: {result['title']}")
        print(f"URL: {result['link']}")
        print(f"Description: {result['snippet']}")
        print()
else:
    print("Aucun résultat trouvé")