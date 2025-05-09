from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") 

#Armazenar ultimo dado recebido
ultimo_dado = {} # Parece que ele armazena o último dado aqui

@app.route('/dados', methods = ['POST']) # Endpoint: /dados, Método: POST
def receber_dados():
    global ultimo_dado
    data = request.json # <<-- IMPORTANTE: Ele espera um JSON!
    ultimo_dado = data  #Salva os ultimos dados recebidos
    print(f"Dados recebidos: {data}") # Imprime o JSON recebido
    socketio.emit('novo_dado', data) # Emite para WebSockets, provavelmente para atualizar um dashboard
    return {"status": "ok"}, 200

# ... (o resto é para dashboards, não interfere no recebimento) ...

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    socketio.run(app, host='0.0.0.0', port=port)