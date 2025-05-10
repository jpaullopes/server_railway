document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    socket.on("novo_dado", function (dado) {
        const statusBotaoAElement = document.getElementById("status_botao_a");
        const statusBotaoBElement = document.getElementById("status_botao_b");

        // O PicoW envia a chave "button" (minúsculo)
        if (dado && typeof dado.button !== 'undefined') {
            // Atualiza o texto do Botão A
            statusBotaoAElement.innerText = dado.button == 1 ? "Pressionado!" : "Solto";

            // Adiciona/remove classes para estilização visual
            if (dado.button == 1) {
                statusBotaoAElement.classList.add("pressionado");
                statusBotaoAElement.classList.remove("solto");
            } else {
                statusBotaoAElement.classList.add("solto");
                statusBotaoAElement.classList.remove("pressionado");
            }
        } else {
            // Se não houver informação do botão, mostra N/A
            statusBotaoAElement.innerText = "N/A";
            statusBotaoAElement.classList.remove("pressionado", "solto");
        }

        // Botão B continuará como N/A, pois não recebemos dados para ele
        statusBotaoBElement.innerText = "N/A";
        // Remove quaisquer classes de estado do Botão B, caso existam
        statusBotaoBElement.classList.remove("pressionado", "solto");
        statusBotaoBElement.classList.add("na"); // Adiciona uma classe para estilizar o N/A
    });
});