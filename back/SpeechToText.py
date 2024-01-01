from vosk import Model, KaldiRecognizer
from TextToSpeech import sayInstruction
import pyaudio

vModel = Model(r"D:\Flobot\vosk-model-small-fr-0.22")#ça tu dois le télécharger, ça permet d'éviter que la connection soit nécéssaire
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
        #print(text)
