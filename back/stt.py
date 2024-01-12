import pyaudio
from vosk import Model, KaldiRecognizer
from utils.ActionsFromText import executeAction

model_path = r"D:\a\flowbot\flowbot\back\vosk-model-small-fr-0.22"
sample_rate = 16000
chunk_size = 1024

model = Model(model_path)
recognizer = KaldiRecognizer(model, sample_rate)
audio = pyaudio.PyAudio()

stream = audio.open(format=pyaudio.paInt16, channels=1, rate=sample_rate, input=True, frames_per_buffer=chunk_size)
stream.start_stream()

try:
    while True:
        data = stream.read(chunk_size)
        if recognizer.AcceptWaveform(data):
            result = recognizer.Result()
            query = result[14:-3].lower().strip()
            executeAction(query)
except KeyboardInterrupt:
    print("\nKeyboardInterrupt: Arrêt du STT")
finally:
    stream.stop_stream()
    stream.close()
    audio.terminate()
