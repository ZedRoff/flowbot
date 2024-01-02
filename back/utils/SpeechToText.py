from vosk import Model, KaldiRecognizer
from utils.TextToSpeech import sayInstruction
import pyaudio

def startup():
    vModel = Model(r"C:\Users\amang\Desktop\flowbot\flowbot\back\vosk-model-small-fr-0.22")
    vRecognizerVocal = KaldiRecognizer(vModel, 16000)
    
    vMicro = pyaudio.PyAudio()
    stream = vMicro.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
    stream.start_stream()
    
   
    while True:
        data = stream.read(1024)
        if vRecognizerVocal.AcceptWaveform(data):
            vText = vRecognizerVocal.Result()
            print(vText)
            print(f"' {vText[14:-3]} '")
            if (vText[14:-3]).__contains__("ok google"):
                sayInstruction("oui")
                

if __name__ == "__main__":
    startup()