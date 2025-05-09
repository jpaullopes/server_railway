document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    socket.on("novo_dado", function (dado) {
        // Verifica se os dados dos botões existem antes de tentar acessá-los

        const statusBotaoAElement = document.getElementById("status_botao_a");
        const statusBotaoBElement = document.getElementById("status_botao_b");

        if (dado && typeof dado.botao_a !== 'undefined') {
            statusBotaoAElement.innerText = dado.botao_a == 1 ? "Pressionado!" : dado.botao_a == 0 ? "Solto" : "N/A";
        } else {
            statusBotaoAElement.innerText = "N/A";
        }
        if (dado && typeof dado.botao_b !== 'undefined') {
            statusBotaoBElement.innerText = dado.botao_b == 1 ? "Pressionado!" : dado.botao_b == 0 ? "Solto" : "N/A";
        } else {
            statusBotaoBElement.innerText = "N/A";
        }
    });
});