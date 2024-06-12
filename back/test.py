from datetime import datetime, timedelta

# Exemple pour convertir une chaîne de caractères en objet time et ajouter 10 secondes
alarm_time_str = "07:00"  # Remplacez par l'heure de votre alarme
alarm_time = datetime.strptime(alarm_time_str, "%H:%M").time()
alarm_datetime = datetime.combine(datetime.today(), alarm_time)

# Ajouter 10 secondes
alarm_datetime_plus_10 = alarm_datetime + timedelta(seconds=10)
alarm_time_plus_10 = alarm_datetime_plus_10.time()

print(f"Alarme initiale: {alarm_time}")
print(f"Alarme avec 10 secondes ajoutées: {alarm_time_plus_10}")