document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // 1. Conecta no servidor (o recepcionista lá do app.py)

    socket.on("novo_dado", function (dado) { // 2. Fica escutando a mensagem "novo_dado"
        // Pega os lugares no HTML onde a informação vai aparecer
        const statusBotaoAElement = document.getElementById("status_botao_a");
        const statusBotaoBElement = document.getElementById("status_botao_b");

        // 3. Verifica se a informação recebida é sobre os botões
        if (dado && typeof dado.botao_a !== 'undefined') {
            // Se o 'dado' tem 'botao_a', atualiza o Botão A
            statusBotaoAElement.innerText = dado.botao_a == 1 ? "Pressionado!" : dado.botao_a == 0 ? "Solto" : "N/A";
        } else {
            // Se não tem informação do Botão A no 'dado' atual
            statusBotaoAElement.innerText = "N/A";
        }

        if (dado && typeof dado.botao_b !== 'undefined') {
            // Se o 'dado' tem 'botao_b', atualiza o Botão B
            statusBotaoBElement.innerText = dado.botao_b == 1 ? "Pressionado!" : dado.botao_b == 0 ? "Solto" : "N/A";
        } else {
            // Se não tem informação do Botão B no 'dado' atual
            statusBotaoBElement.innerText = "N/A";
        }
    });
});