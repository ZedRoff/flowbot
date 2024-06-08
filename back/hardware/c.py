import RPi.GPIO as GPIO
import time
 
# Setup port name
GPIO.setmode(GPIO.BOARD)
 
# Setup ports (pull down = btn)
GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(15, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
 
# Variables to track the state of the rotary encoder
last_state = (0, 0)
direction = None
 
def rotary_callback(channel):
    global last_state, direction
    state = (GPIO.input(13), GPIO.input(15))
 
    if last_state == (0, 0):
        if state == (1, 0):
            direction = "DROITE"
        elif state == (0, 1):
            direction = "GAUCHE"
    elif last_state == (1, 0):
        if state == (1, 1):
            direction = "DROITE"
        elif state == (0, 0):
            direction = "GAUCHE"
    elif last_state == (1, 1):
        if state == (0, 1):
            direction = "DROITE"
        elif state == (1, 0):
            direction = "GAUCHE"
    elif last_state == (0, 1):
        if state == (0, 0):
            direction = "DROITE"
        elif state == (1, 1):
            direction = "GAUCHE"
 
    last_state = state
    if direction:
        print(direction)
 
# Add event detection on GPIO pins with debounce time
GPIO.add_event_detect(13, GPIO.BOTH, callback=rotary_callback, bouncetime=50)
GPIO.add_event_detect(15, GPIO.BOTH, callback=rotary_callback, bouncetime=50)
 
# Keep the script running
try:
    while True:
        time.sleep(0.001)
except KeyboardInterrupt:
    GPIO.cleanup()
 
