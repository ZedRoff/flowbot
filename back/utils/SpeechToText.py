from vosk import Model, KaldiRecognizer
from utils.TextToSpeech import sayInstruction
import pyaudio

def startup():
    vModel = Model(r"C:\Users\amang\Desktop\flowbot\flowbot\back\vosk-model-small-fr-0.22")
    vRecognizerVocal = KaldiRecognizer(vModel, 16000)
    
    vMicro = pyaudio.PyAudio()
    stream = vMicro.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
    stream.start_stream()
    flag = False
   
    while True:
        data = stream.read(1024)
        if vRecognizerVocal.AcceptWaveform(data):
            vText = vRecognizerVocal.Result()
            print(vText)
            print(f"' {vText[14:-3]} '")
            if (vText[14:-3]).__contains__("flo"):
                flag = True
                sayInstruction("Oui, que puis-je faire pour vous ?")
            if(vText[14:-3]).__contains__("merci") and flag:
                flag = False
                sayInstruction("Pas de soucis")
                

