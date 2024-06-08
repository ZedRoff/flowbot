import RPi.GPIO as GPIO
import threading
import time

#Setup port name
GPIO.setmode(GPIO.BOARD)
 
#Setup port (pull down = btn)
GPIO.setup(36,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
 
while(True):
    time.sleep(0.1)
    print(GPIO.input(36))
