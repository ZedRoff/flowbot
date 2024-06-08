import RPi.GPIO as GPIO
import threading
import time
#To start script, start the thread


#Setup port name
GPIO.setmode(GPIO.BOARD)

#Setup port (pull down = btn)
GPIO.setup(36,GPIO.OUT)
GPIO.output(36, GPIO.HIGH)
