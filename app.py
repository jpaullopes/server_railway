from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") 

#Armazenar ultimo dado recebido
ultimo_dado = {}

@app.route('/dados', methods = ['POST'])
def receber_dados():
    global ultimo_dado
    data= request.json
    ultimo_dado = data  #Salva os ultimos dados recebidos
    print(f"Dados recebidos: {data}")
    socketio.emit('novo_dado', data) 
    return {"status": "ok"}, 200

@app.route('/dashboard/botoes')
def dashboard_botoes():
    return render_template('botoes.html')

@app.route('/dashboard/joystick')
def dashboard_joystick():
    return render_template('joystick.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host='0.0.0.0', port=port)
