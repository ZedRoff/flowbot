from flask import Flask, request, jsonify
from utils.TextToSpeech import sayInstruction
import threading
from flask_cors import CORS



app = Flask(__name__)
CORS(app)


@app.route('/')
def hello():
    return 'API is working'

@app.route('/talk', methods=['POST'])
def talk():
    print("seen")
    if request.method == 'POST':
        data = request.get_json()
        textToSay = data['textToSay']
        instruction_thread = threading.Thread(target=sayInstruction, args=(textToSay,))
        instruction_thread.start()
        response = jsonify({'result': 'success'})
        return response
   
if __name__ == '__main__':
    app.run(debug=True)