document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    const statusValorXElement = document.getElementById("x");
    const statusValorYElement = document.getElementById("y");
    const statusDirecaoElement = document.getElementById("direcao"); // Se você ainda usa
    const compassArrowElement = document.getElementById("compass-arrow"); // Pega o elemento da seta

    socket.on("novo_dado", function(dado) {
        let valorX = "--";
        let valorY = "--";
        let direcaoTextual = "--"; // Para a direção textual, se houver

        if (dado && typeof dado.x !== 'undefined' && typeof dado.y !== 'undefined') {
            valorX = dado.x;
            valorY = dado.y;

            // Atualiza os valores X e Y
            statusValorXElement.innerText = valorX;
            statusValorYElement.innerText = valorY;

            if (compassArrowElement) {
               
                // Vamos assumir Y positivo para CIMA no joystick (como em um gráfico cartesiano)
                let angleRad = Math.atan2(parseFloat(valorY), parseFloat(valorX));
                let angleDeg = angleRad * (180 / Math.PI);

                let displayAngleDeg = angleDeg - 90; // Ajuste para alinhar a seta (que aponta para cima) com o ângulo trigonométrico
                                                 // onde 0 é direita e 90 é cima.
                
                // Se o joystick está no centro (ou os valores não são numéricos), não gira
                if (!isNaN(parseFloat(valorX)) && !isNaN(parseFloat(valorY)) && (parseFloat(valorX) !== 0 || parseFloat(valorY) !== 0)) {
                    compassArrowElement.style.transform = `rotate(${displayAngleDeg}deg)`;
                } else {
                     // Opcional: resetar para uma posição padrão se estiver no centro, ex: apontar para cima
                    compassArrowElement.style.transform = 'rotate(-90deg)'; // Ou a orientação que você quer para (0,0)
                }
            }

            // Atualiza a direção textual, se você ainda a usa
            if (dado && typeof dado.direcao !== 'undefined') {
                 direcaoTextual = dado.direcao;
            }
        } else if (dado && (typeof dado.botao_a !== 'undefined' || typeof dado.botao_b !== 'undefined')) {
          
        } else {
            // Dados não reconhecidos ou incompletos para joystick
            statusValorXElement.innerText = "--";
            statusValorYElement.innerText = "--";
            if (compassArrowElement) {
                 compassArrowElement.style.transform = 'rotate(-90deg)'; // Ou como preferir
            }
        }
        
        if (statusDirecaoElement) { // Somente atualiza se o elemento existir
            statusDirecaoElement.innerText = direcaoTextual;
        }
    });

});