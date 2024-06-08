import RPi.GPIO as GPIO
from flask_socketio import emit
import time
 
#Setup port name
GPIO.setmode(GPIO.BOARD)
 
#Setup port (pull down = btn)
GPIO.setup(13,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(15,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)



def run_molette():
     while(True):
          time.sleep(0.001)
          if not GPIO.input(13) and GPIO.input(15):
               emit('message', {'message': 'GAUCHE', 'from': 'back', 'type': 'molette'}, broadcast=True, namespace='/')
            
               time.sleep(0.5)
          elif not GPIO.input(15) and GPIO.input(13):
               emit('message', {'message': 'GAUCHE', 'from': 'back', 'type': 'molette'}, broadcast=True, namespace='/')
            
               time.sleep(0.5)
      
   
