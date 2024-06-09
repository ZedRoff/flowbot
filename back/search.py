import requests
from bs4 import BeautifulSoup
import wikipedia

wikipedia.set_lang("fr")    

def get_wikipedia_summary(query):
    try:
        summary = wikipedia.summary(query, sentences=3)
        page = wikipedia.page(query)
        return summary, page.url
    except wikipedia.exceptions.DisambiguationError as e:
        # Si plusieurs options sont trouvées, utiliser la première
        summary = wikipedia.summary(e.options[0], sentences=3)
        page = wikipedia.page(e.options[0])
        return summary, page.url
    except wikipedia.exceptions.PageError:
        return "Aucune description disponible sur Wikipedia.", ""


def get_image(query):
    # Effectue une recherche d'image sur Google et retourne l'URL de la première image
    url = f"https://www.google.com/search?q={query}&tbm=isch"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    images = soup.find_all('img')
    if images:
        img_url = images[1]['src']  # Le premier résultat est souvent un logo Google, on prend le deuxième
        return img_url
    return None


def main():
    query = input("Entrez le sujet de recherche: ")
    summary = get_wikipedia_summary(query)
    img_url = get_image(query)

    if summary:
        print(f"Résumé de {query}: {summary}")
    else:
        print("Aucun résumé trouvé")

    if img_url:
        print(f"Image URL: {img_url}")
    else:
        print("Aucune image trouvée")

if __name__ == "__main__":
    summary, wiki_link = get_wikipedia_summary("Marie_Curie")
    print(summary)
