import RPi.GPIO as GPIO
import threading
import time
#To start script, start the thread


#Setup port name
GPIO.setmode(GPIO.BOARD)

#Setup port (pull down = btn)
GPIO.setup(11,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(13,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(15,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(16,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
#Variable time / counter
actionCounter = 0
timePast = 0.0
timePast2 = 0.0
stopTime2 = False
stopTime = False
prevVal = False
prevValMol = False
previousPosD = 0
previousPosG = 0

#get bool
def getInput(num):
    return GPIO.input(num) == 1

#get val
def getInt(num):
    return GPIO.input(num)

#do action
def action(doubleAction):
    if( not doubleAction):
        print("action 0") #Add function
    elif (doubleAction): 
        print("action 1") #Add function
    elif(doubleAction == 2): 
        print("action 3") #Add function
    elif(doubleAction == 3): 
        print("action 4") #Add function

#thread
def actionThread():
    thread1 = threading.Thread(target =run)
    thread1.start()

def run():
    global stopTime,actionCounter,timePast,previousPosD,previousPosG,stopTime2,timePast2
    valInt=0
    valInt2=0
    while(True):
        time.sleep(0.001)
        if(not GPIO.input(13) or not GPIO.input(15)) : #Encodeur (mollette)
            
            if(not GPIO.input(13) and not GPIO.input(15)) :
                valInt=1
            else :
                valInt=0

            if(valInt==0):
                if(not GPIO.input(13) and valInt2==0):
                    valInt2=1
                if(not GPIO.input(15)and valInt2==0):
                    valInt2=2

                if(valInt2==1 and not GPIO.input(15)):
                    print("GAUCHE") #Action left (add function)
                    valInt2=0
                if(valInt2==2 and not GPIO.input(13)):
                    print("DROITE") #Action right (add function)
                    valInt2=0
                    
        if(GPIO.input(11)): #Boutton
            if(not prevVal):
                actionCounter+=1
                timePast=0
                prevVal = True
                stopTime = False
                if(actionCounter == 3):
                    actionCounter = 0
                action(actionCounter) #Action function
        elif(not stopTime): #timming (if you want, add a held-up button)
            prevVal = False
            if(timePast > 0.5):
                actionCounter = 0
                stopTime = True
                timePast = 0.0
            else :
                timePast+= 0.1

        if(GPIO.input(16)): #Boutton mollette
            if(not prevValMol):
                timePast2=0
                prevValMol = True
                stopTime2 = False
                action(3) #Action function
        elif(not stopTime2):
            prevValMol = False
            if(timePast2 > 0.5):
                stopTime2 = True
                timePast2 = 0.0
            else :
                timePast2+= 0.1
