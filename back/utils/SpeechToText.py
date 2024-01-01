from vosk import Model, KaldiRecognizer
from back.utils.TextToSpeech import sayInstruction
import pyaudio

vModel = Model(r"C:\Users\amang\Desktop\flowbot\flowbot\back\vosk-model-small-fr-0.22") # A changer en fonction de ton utilisation, j'ai mit le fichier dans le gitignore afin qu'il soit ignorer par github, mais si tu modifies ce fichier, il faudra donc l'upload manuellement
vRecognizerVocal = KaldiRecognizer(vModel, 16000)#le convertisseur
    
vMicro = pyaudio.PyAudio()
stream = vMicro.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
stream.start_stream()#pour mettre en place l'audio
    
while True:
    data = stream.read(4096) #Parfois il fais une erreur, je règlerais ça après
    if vRecognizerVocal.AcceptWaveform(data):
        vText = vRecognizerVocal.Result()#Il fait la conversion juste ici
        print(f"' {vText[14:-3]} '")
        if (vText).__contains__("ok google"):
            sayInstruction("oui")
      
