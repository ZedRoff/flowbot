from flask import Flask, request, jsonify
from utils.TextToSpeech import sayInstruction
import threading
from flask_cors import CORS


from utils.SpeechToText import startup


app = Flask(__name__)
CORS(app)


@app.route('/')
def hello():
    return 'API is working'

@app.route('/talk', methods=['POST'])
def talk():
    if request.method == 'POST':
        data = request.get_json()
        textToSay = data['textToSay']
        instruction_thread = threading.Thread(target=sayInstruction, args=(textToSay,))
        instruction_thread.start()
        response = jsonify({'result': 'success'})
        return response
   




if __name__ == '__main__':
    t1 = threading.Thread(target=startup)
    t2 = threading.Thread(target=app.run, kwargs={'debug': True})
    try:
        t1.start()
        t2.start()
    except KeyboardInterrupt:
        pass # on peut pas détruire un thread, faut que je vois pour régler ça, mais ça marche quand même
