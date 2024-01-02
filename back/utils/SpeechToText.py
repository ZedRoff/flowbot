from vosk import Model, KaldiRecognizer
from utils.TextToSpeech import sayInstruction
import pyaudio
import time
def startup():
    vModel = Model(r"C:\Users\amang\Desktop\flowbot\flowbot\back\vosk-model-small-fr-0.22")
    vRecognizerVocal = KaldiRecognizer(vModel, 16000)
    
    vMicro = pyaudio.PyAudio()
    stream = vMicro.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
    stream.start_stream()
    flag = False
    start_time = None
   
    while True:
        try:
            data = stream.read(1024)
            if vRecognizerVocal.AcceptWaveform(data):
                vText = vRecognizerVocal.Result()
              
                print(f"' {vText[14:-3]} '")


                if (vText[14:-3]).__contains__("flo"):
                    flag = True
                    start_time = time.time()
                    sayInstruction("Oui, que puis-je faire pour vous ?")


                if(vText[14:-3]).__contains__("test") and flag:
                    flag = False
                    sayInstruction("Le test est OK")


                if flag and time.time() - start_time >= 5:
                    sayInstruction("Aucune commande n'a été proposée, je repasse en veille")
                    flag = False

                    
        except KeyboardInterrupt:
           print("\nKeyboardInterrupt: Arrêt du STT")
