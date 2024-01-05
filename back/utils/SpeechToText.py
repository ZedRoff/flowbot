from vosk import Model, KaldiRecognizer
from utils.ActionsFromText import executeAction
import pyaudio
def startup():
    vModel = Model(r"D:\a\flowbot\back\vosk-model-fr-0.22")
    vRecognizerVocal = KaldiRecognizer(vModel, 16000)
    vMicro = pyaudio.PyAudio()
    stream = vMicro.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
    stream.start_stream()
    while True:
        try:
            data = stream.read(1024)
            if vRecognizerVocal.AcceptWaveform(data):
                vText = vRecognizerVocal.Result()
                query = vText[14:-3].lower().strip()
                executeAction(f"{query}")
        except KeyboardInterrupt:
           print("\nKeyboardInterrupt: Arrêt du STT")