document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    // Verifica se o socket conectou
    socket.on('connect', function() {
        console.log('SocketIO conectado na página de botões!');
    });

    socket.on('connect_error', (err) => {
        console.error('Erro ao conectar SocketIO:', err);
    });

    socket.on("novo_dado", function (dado) {
        console.log("Dados recebidos na página de botões:", dado); // LOG IMPORTANTE!

        const statusBotaoAElement = document.getElementById("status_botao_a");
        const statusBotaoBElement = document.getElementById("status_botao_b");

        let textoBotaoA = "0"; // Valor padrão se não houver dados ou botão solto
        let estadoBotaoA = 0;  // Valor numérico do estado (0 para solto, 1 para pressionado)

        if (dado && typeof dado.button !== 'undefined') {
            estadoBotaoA = parseInt(dado.button, 10); // Garante que é um número
            if (estadoBotaoA === 1) {
                textoBotaoA = "Pressionado!";
            } else {
                textoBotaoA = "0"; // Se for 0 ou qualquer outro valor não-1, consideramos "0" (solto)
            }
        } else {
            // Se 'dado.button' não estiver definido, continua como "0" (estado padrão)
            console.log("'dado.button' não definido. Usando '0' como padrão.");
        }

        statusBotaoAElement.innerText = textoBotaoA;

        // Adiciona/remove classes para estilização visual
        if (estadoBotaoA === 1) {
            statusBotaoAElement.classList.add("pressionado");
            statusBotaoAElement.classList.remove("solto", "na"); // Remove 'na' também
        } else {
            statusBotaoAElement.classList.add("solto"); // Classe para estado "0" / solto
            statusBotaoAElement.classList.remove("pressionado", "na");
        }

        // Para o Botão B, como não temos dados para ele:
        statusBotaoBElement.innerText = "0"; // Mostrar "0"
        statusBotaoBElement.classList.add("na"); // Classe para estilizar como N/A ou desabilitado
        statusBotaoBElement.classList.remove("pressionado", "solto");
    });
});