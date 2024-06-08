import RPi.GPIO as GPIO
import threading
import time
 
#Setup port name
GPIO.setmode(GPIO.BOARD)
 
#Setup port (pull down = btn)
GPIO.setup(13,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(15,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
flag = True
last = ""
while(True):
     time.sleep(0.001)
     if not GPIO.input(13) and GPIO.input(15):
          print("GAUCHE")
          time.sleep(0.5)
     elif not GPIO.input(15) and GPIO.input(13):
          print("DROITE")
          time.sleep(0.5)
      
   
