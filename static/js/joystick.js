document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

        socket.on("novo_dado", function(dado) {
            // Verifica se os dados do joystick existem
            const statusValorXElement = document.getElementById("x");
            const statusValorYElement = document.getElementById("y");
            const statusDirecaoElement = document.getElementById("direcao");

            statusValorXElement.innerText = (dado && typeof dado.x !== 'undefined') ? dado.x : "--";
            statusValorYElement.innerText = (dado && typeof dado.y !== 'undefined') ? dado.y : "--";
            statusDirecaoElement.innerText = (dado && typeof dado.direcao !== 'undefined') ? dado.direcao : "--";
        });
}); 