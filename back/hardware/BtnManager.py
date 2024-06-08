import RPi.GPIO as GPIO
import time
from threading import Thread
 
#Setup port name
GPIO.setmode(GPIO.BOARD)
 
#Setup port (pull down = btn)
GPIO.setup(11,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(13,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(15,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(36,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)


molette_appuyer = False
action_appuyer = False

def run_molette():
     
     while(True):
          time.sleep(0.001)
          if not GPIO.input(13) and GPIO.input(15):
               print("GAUCHE")
               time.sleep(0.5)
          elif not GPIO.input(15) and GPIO.input(13):
               print("DROITE")
               time.sleep(0.5)
def run_bouttons():
     global molette_appuyer, action_appuyer
     while(True):
          time.sleep(0.1)
          if GPIO.input(36) and not molette_appuyer:
               print("BOuton molette appuyé")
               molette_appuyer = True
          elif not GPIO.input(36) and molette_appuyer:
               print("Bouton molette relaché")
               molette_appuyer = False
          if GPIO.input(11) and not action_appuyer:
               print("Bouton action appuyé")
               action_appuyer = True
          elif not GPIO.input(11) and action_appuyer:
               print("Bouton action relaché")
               action_appuyer = False
Thread(target=run_molette).start()
Thread(target=run_bouttons).start()
