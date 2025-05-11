// Arquivo: servidor_railway/static/js/botoes.js
document.addEventListener("DOMContentLoaded", (evento) => {

    const socket = io();

    socket.on('connect', function() {
        console.log('SocketIO conectado na página de botões!');
    });

    socket.on('connect_error', (err) => {
        console.error('Erro ao conectar SocketIO:', err);
    });

    socket.on("novo_dado", function (dado) {
        console.log("Dados recebidos (com temperatura):", dado);


    socket.on("novo_dado", function (dado) { // 2. Fica escutando a mensagem "novo_dado"
        // Pega os lugares no HTML onde a informação vai aparecer
        const statusBotaoAElement = document.getElementById("status_botao_a");
        const statusBotaoBElement = document.getElementById("status_botao_b");
        const statusTemperaturaElement = document.getElementById("status_temperatura"); // Novo elemento


        // --- Processamento para o Botão A ---
        let textoBotaoA = "0";
        let estadoNumericoA = 0;
        if (dado && typeof dado.button_a !== 'undefined') {
            estadoNumericoA = parseInt(dado.button_a, 10);
            textoBotaoA = (estadoNumericoA === 1) ? "Pressionado!" : "0";
        } else {
            console.warn("'dado.button_a' não definido. Usando '0'.");
        }
        statusBotaoAElement.innerText = textoBotaoA;
        statusBotaoAElement.classList.remove("pressionado", "solto", "na");
        statusBotaoAElement.classList.add(estadoNumericoA === 1 ? "pressionado" : "solto");

        // --- Processamento para o Botão B ---
        let textoBotaoB = "0";
        let estadoNumericoB = 0;
        if (dado && typeof dado.button_b !== 'undefined') {
            estadoNumericoB = parseInt(dado.button_b, 10);
            textoBotaoB = (estadoNumericoB === 1) ? "Pressionado!" : "0";
        } else {
            console.warn("'dado.button_b' não definido. Usando '0'.");
        }
        statusBotaoBElement.innerText = textoBotaoB;
        statusBotaoBElement.classList.remove("pressionado", "solto", "na");
        statusBotaoBElement.classList.add(estadoNumericoB === 1 ? "pressionado" : "solto");

        // --- Processamento para a Temperatura ---
        let textoTemperatura = "--"; // Valor padrão se não houver dados
        if (dado && typeof dado.temperature !== 'undefined') {
            // Formata para duas casas decimais, mesmo que venha com mais ou menos
            // O parseFloat garante que é um número antes de tentar formatar.
            const temperaturaNumerica = parseFloat(dado.temperature);
            if (!isNaN(temperaturaNumerica)) { // Verifica se é um número válido
                textoTemperatura = temperaturaNumerica.toFixed(2); // Formata para 2 casas decimais
            } else {
                console.warn("'dado.temperature' não é um número válido:", dado.temperature);
                textoTemperatura = "Erro"; // Ou mantém "--"
            }
        } else {
            console.warn("'dado.temperature' não definido. Usando '--'.");
        }
        statusTemperaturaElement.innerText = textoTemperatura;
        // Você pode adicionar classes CSS para a temperatura se quiser estilizar (ex: cor por faixa)
        // Ex: statusTemperaturaElement.className = ''; // Limpa classes antigas
        // if (temperaturaNumerica > 30) statusTemperaturaElement.classList.add("quente");
    });
});