import keyboard
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

previous_word = None

@app.route('/receive_words', methods=['POST'])
def receive_words():
    global previous_word
    data = request.get_json()
    words = data.get('words', [])
    print("Received words:")
    for word in words:
        print(word)
        if word != previous_word:
            keyboard.write(word + ' ')  
            previous_word = word
    return jsonify({"status": "success", "received_words": words})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)