def calculer_notes_minimales(notes, moyenne_cible):
    somme_produits_locked = sum(note['note'] * note['coefficient'] for note in notes if note['locked'])
    somme_coefficients_locked = sum(note['coefficient'] for note in notes if note['locked'])
    somme_coefficients_unlocked = sum(note['coefficient'] for note in notes if not note['locked'])

    if somme_coefficients_unlocked == 0:
        return "Toutes les matières sont verrouillées. Impossible de modifier les notes pour atteindre la moyenne cible."

    somme_produits_cible = moyenne_cible * (somme_coefficients_locked + somme_coefficients_unlocked)
    note_necessaire = (somme_produits_cible - somme_produits_locked) / somme_coefficients_unlocked

    return [{"matiere": note['matiere'], "note_minimale": note_necessaire} for note in notes if not note['locked']]

# Exemple d'utilisation
notes = [
    {"matiere": "électronique", "note": 15, "coefficient": 3, "locked": True},
    {"matiere": "physique", "note": 10, "coefficient": 2, "locked": True},
    {"matiere": "mathematiques", "note": 12, "coefficient": 3, "locked": False},
    {"matiere": "informatique", "note": 0, "coefficient": 2, "locked": False}
]

moyenne_cible = 14
notes_minimales = calculer_notes_minimales(notes, moyenne_cible)

for note in notes_minimales:
    print(f"Pour la matière {note['matiere']}, vous devez obtenir au moins {note['note_minimale']:.2f} pour atteindre une moyenne de {moyenne_cible}.")
