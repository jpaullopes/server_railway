document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    // Seleciona todos os elementos de direção da rosa dos ventos
    const direcoesRose = {
        "N": document.querySelector(".wind-rose .north"),
        "NE": document.querySelector(".wind-rose .northeast"),
        "E": document.querySelector(".wind-rose .east"),
        "SE": document.querySelector(".wind-rose .southeast"),
        "S": document.querySelector(".wind-rose .south"),
        "SO": document.querySelector(".wind-rose .southwest"), // Corrigido para SO
        "O": document.querySelector(".wind-rose .west"),   // Corrigido para O
        "NO": document.querySelector(".wind-rose .northwest"), // Corrigido para NO
        // Adicione "Centro" ou um estado neutro se o joystick puder estar no centro sem direção
        "Centro": null // Ou algum elemento se tiver um display para "Centro"
    };

    socket.on("novo_dado", function(dado) {
        const statusValorXElement = document.getElementById("x");
        const statusValorYElement = document.getElementById("y");
        const statusDirecaoElement = document.getElementById("direcao");

        statusValorXElement.innerText = (dado && typeof dado.x !== 'undefined') ? dado.x : "--";
        statusValorYElement.innerText = (dado && typeof dado.y !== 'undefined') ? dado.y : "--";
        
        let direcaoJoystick = (dado && typeof dado.direcao !== 'undefined') ? dado.direcao.toUpperCase() : "CENTRO";
        statusDirecaoElement.innerText = direcaoJoystick !== "CENTRO" ? direcaoJoystick : "--";


        // Atualiza a rosa dos ventos
        // Primeiro, remove a classe 'active' de todas as direções
        for (const key in direcoesRose) {
            if (direcoesRose[key]) { // Verifica se o elemento existe
                direcoesRose[key].classList.remove("active");
            }
        }

        let direcaoMapeada = direcaoJoystick; // Assume que já vem como N, NE, etc.
                                     
        if (direcoesRose[direcaoMapeada] && direcoesRose[direcaoMapeada] !== null) {
            direcoesRose[direcaoMapeada].classList.add("active");
        } else if (direcaoMapeada !== "CENTRO") {
            console.warn("Direção não mapeada na rosa dos ventos:", direcaoMapeada);
        }
    });
});