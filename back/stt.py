import pyaudio
from vosk import Model, KaldiRecognizer
from utils.ActionsFromText import execute_action
import sqlite3

con = sqlite3.connect("./db/database.db", check_same_thread=False)

#model_path = r"C:\Users\amang\Desktop\flowbot\flowbot\back\vosk-model-small-fr-0.22"
model_path = r"./vosk-model-small-fr-0.22"
sample_rate = 16000
chunk_size = 1024

model = Model(model_path)
recognizer = KaldiRecognizer(model, sample_rate)
audio = pyaudio.PyAudio()

stream = audio.open(format=pyaudio.paInt16, channels=1, rate=sample_rate, input=True, frames_per_buffer=chunk_size)
stream.start_stream()

try:
    while True:
        cur = con.cursor()
        cur.execute("SELECT mic FROM muted")
        muted = cur.fetchone()
        cur.close()
        if muted[0] == "on":
            continue

        data = stream.read(chunk_size)

        if recognizer.AcceptWaveform(data):
            result = recognizer.Result()
            query = result[14:-3].lower().strip()
            execute_action(query)
            print(query)
            print(result)
except KeyboardInterrupt:
    print("\nKeyboardInterrupt: Arrêt du STT")
finally:
    stream.stop_stream()
    stream.close()
    audio.terminate()
