from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") 

#Armazenar ultimo dado recebido
ultimo_dado = {} # Esta variável agora pode conter dados do joystick OU dos botões

@app.route('/dados', methods = ['POST'])
def receber_dados():
    global ultimo_dado
    data = request.json
    ultimo_dado = data  #Salva os ultimos dados recebidos
    print(f"Dados recebidos (pode ser joystick ou botões): {data}")
    # O mesmo evento é emitido. O cliente decide como interpretar.
    socketio.emit('novo_dado', data) 
    return {"status": "ok"}, 200

@app.route('/dashboard/botoes')
def dashboard_botoes():
    # Passamos o ultimo_dado para que o template possa ter um estado inicial
    # se ele for compatível com botões.
    return render_template('botoes.html', initial_data=ultimo_dado)

@app.route('/dashboard/joystick')
def dashboard_joystick():
    return render_template('joystick.html', initial_data=ultimo_dado)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    socketio.run(app, host='0.0.0.0', port=port, debug=True)