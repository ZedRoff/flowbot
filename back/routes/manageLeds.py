import RPi.GPIO as GPIO
import time


from flask import Blueprint, request, jsonify

bp = Blueprint('manage_leds', __name__)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(16,GPIO.OUT)
GPIO.setup(18,GPIO.OUT)
blink_color = ""

@bp.route('/api/manageLeds', methods=['POST'])
def manage_leds():
    global blink_color
    if request.method == 'POST':
        try:
            data = request.get_json()
            light = data['light']
            mode = data['mode']
            if light == "white" and mode == "on":
                blink_color = ""
                GPIO.output(16, GPIO.HIGH)
               
                GPIO.output(18, GPIO.LOW)
            elif light == "blue" and mode == "on":
                blink_color = ""
                GPIO.output(16, GPIO.LOW)
               
                GPIO.output(18, GPIO.HIGH)
            elif light == "white" and mode == "off":
                blink_color = ""
                GPIO.output(16, GPIO.LOW)
                GPIO.output(18, GPIO.LOW)
            elif light == "blue" and mode == "off":
                blink_color = ""
                GPIO.output(18, GPIO.LOW)
                GPIO.output(16, GPIO.LOW)
            elif light == "blue" and mode == "blink":
                blink_color = "blue"
             
                GPIO.output(16, GPIO.LOW)
                GPIO.output(18, GPIO.LOW)
            
                while blink_color == "blue":
                    GPIO.output(18, GPIO.HIGH)
                    time.sleep(1)
                    GPIO.output(18, GPIO.LOW)
                    time.sleep(1)
            elif light == "white" and mode == "blink":
                blink_color = "white"
             
                GPIO.output(16, GPIO.LOW)
                GPIO.output(18, GPIO.LOW)
              
                while blink_color == "white":
                    GPIO.output(16, GPIO.HIGH)
                    time.sleep(1)
                    GPIO.output(16, GPIO.LOW)
                    time.sleep(1)   
            elif mode == "stop_blink":
                blink_color = ""
            elif mode == "stop_blink":
                blink_color = ""
            elif mode == "alternate":
                blink_color = "alternate"
                GPIO.output(16, GPIO.LOW)
                GPIO.output(18, GPIO.LOW)
                while blink_color == "alternate":
                    GPIO.output(16, GPIO.LOW)
                    GPIO.output(18, GPIO.HIGH)
                    time.sleep(1)
                    GPIO.output(16, GPIO.HIGH)
                    GPIO.output(18, GPIO.LOW)
                    
                    time.sleep(1)
            elif mode == "stop_alternate":
                blink_color = ""
                GPIO.output(18, GPIO.LOW)
                GPIO.output(16, GPIO.LOW)
            elif mode == "mixed":
                GPIO.output(18, GPIO.HIGH)
                GPIO.output(16, GPIO.HIGH)
            elif mode == "stop_mixed":
                GPIO.output(16, GPIO.LOW)
                GPIO.output(18, GPIO.LOW)
            return jsonify({'result': "success"})



        

        
        except Exception as e:
            return jsonify({'error': str(e)})
        
        



