document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    socket.on('connect', function() {
        console.log('SocketIO conectado na página de botões!');
    });

    socket.on('connect_error', (err) => {
        console.error('Erro ao conectar SocketIO:', err);
    });

    socket.on("novo_dado", function (dado) {
        console.log("Dados recebidos na página de botões:", dado); // Verifique este log no console do navegador!

        const statusBotaoAElement = document.getElementById("status_botao_a");
        const statusBotaoBElement = document.getElementById("status_botao_b");

        let textoBotaoA = "0";
        let estadoNumericoA = 0;
        let textoBotaoB = "0";
        let estadoNumericoB = 0;

        // Processar Botão A
        if (dado && typeof dado.button_a !== 'undefined') {
            estadoNumericoA = parseInt(dado.button_a, 10);
            if (estadoNumericoA === 1) {
                textoBotaoA = "Pressionado!";
            } else {
                textoBotaoA = "0"; // Se for 0 ou qualquer outro valor não-1
            }
        } else {
            console.log("'dado.button_a' não definido. Usando '0'.");
        }
        statusBotaoAElement.innerText = textoBotaoA;
        if (estadoNumericoA === 1) {
            statusBotaoAElement.classList.add("pressionado");
            statusBotaoAElement.classList.remove("solto", "na");
        } else {
            statusBotaoAElement.classList.add("solto"); // Usaremos 'solto' para o estado "0"
            statusBotaoAElement.classList.remove("pressionado", "na");
        }

        // Processar Botão B
        if (dado && typeof dado.button_b !== 'undefined') {
            estadoNumericoB = parseInt(dado.button_b, 10);
            if (estadoNumericoB === 1) {
                textoBotaoB = "Pressionado!";
            } else {
                textoBotaoB = "0"; // Se for 0 ou qualquer outro valor não-1
            }
        } else {
            console.log("'dado.button_b' não definido. Usando '0'.");
        }
        statusBotaoBElement.innerText = textoBotaoB;
        if (estadoNumericoB === 1) {
            statusBotaoBElement.classList.add("pressionado");
            statusBotaoBElement.classList.remove("solto", "na");
        } else {
            statusBotaoBElement.classList.add("solto"); // Usaremos 'solto' para o estado "0"
            statusBotaoBElement.classList.remove("pressionado", "na");
        }
    });
});