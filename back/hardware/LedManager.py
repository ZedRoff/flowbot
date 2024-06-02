import RPi.GPIO as GPIO
import threading
import time
#To start script, start the thread


#Setup port name
GPIO.setmode(GPIO.BOARD)

#Setup port (pull down = btn)
GPIO.setup(18,GPIO.OUT)
GPIO.setup(22,GPIO.OUT)
GPIO.setup(29,GPIO.OUT)

GPIO.setup(31,GPIO.OUT)
GPIO.setup(36,GPIO.OUT)
GPIO.setup(37,GPIO.OUT)
#Variable time / counter


#Action function
def turnOnLed(typeOn,Color):
    ListLed = []
    if(Color == 1):#blue
        ListLed = [18,22,29]
    if(Color == 2):#green
        ListLed = [31,36,37]
    if(Color == 0):#both
        ListLed = [18,22,29,31,36,37]
    if(typeOn >1) :
        run(ListLed,typeOn)
    
    else :
        for led in ListLed:
            if(typeOn == 0) : #off
                GPIO.output(led, GPIO.LOW)
            elif(typeOn == 1) : #on
                GPIO.output(led, GPIO.HIGH)
                print(GPIO.input(led))


def run(ListLed,typeOn):
    if(typeOn == 2 or typeOn == 4):
        for i in range(0,len(ListLed)+typeOn-2):
            if(typeOn == 2) : #gradual left-right
                GPIO.output(ListLed[i], GPIO.HIGH)
            elif(typeOn == 4) : #wave left-right
                if(i<len(ListLed)):
                    GPIO.output(ListLed[i], GPIO.HIGH)
                    if(i>=2):
                        GPIO.output(ListLed[i-2], GPIO.LOW)
                else :
                    GPIO.output(ListLed[i-2], GPIO.LOW)
            time.sleep(0.3)
    else:
        for i in range(len(ListLed)+typeOn-3,-1,-1):
            if(typeOn == 3) : #gradual right-left
                GPIO.output(ListLed[i-1], GPIO.HIGH)
            elif(typeOn == 5) : #wave right-left
                if(i<=2):
                    
                    GPIO.output(ListLed[i], GPIO.LOW)
                else :
                    GPIO.output(ListLed[i-3], GPIO.HIGH)
                    if(i<=len(ListLed)-1):
                        
                        GPIO.output(ListLed[i], GPIO.LOW)
                    
            time.sleep(0.3)
