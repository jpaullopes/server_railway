from flask import Flask, request, jsonify, render_template
from threading import Lock

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

# Guarda o último ângulo/direção do joystick
state = {
    'direction': 'Centro',
    'angle': 0
}
lock = Lock()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['POST'])  # Changed route from /joystick to /api/data
def joystick():
    data = request.get_json()
    if not data or 'direction' not in data:
        return jsonify({'error': 'Invalid payload'}), 400

    # Traduz direção para ângulo
    angles = {
        'Centro': 0,
        'Norte': 0,
        'Leste': 90,
        'Sul': 180,
        'Oeste': 270,
        'Nordeste': 45,
        'Noroeste': 315,
        'Sudeste': 135,
        'Sudoeste': 225
    }
    dir_str = data['direction']
    ang = angles.get(dir_str, 0)

    with lock:
        state['direction'] = dir_str
        state['angle'] = ang

    return jsonify({'status': 'ok'}), 200

@app.route('/state')
def get_state():
    with lock:
        return jsonify(state)

if __name__ == '__main__':
    # porta 8080 se você quiser coincidir com seu Pico W
    app.run(host='0.0.0.0', port=8080)
