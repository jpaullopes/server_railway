document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    // --- Configurações do Joystick (replicadas do seu código C) ---
    const DEAD_ZONE_MIN = 35;    // Limite inferior da zona morta (0-100)
    const DEAD_ZONE_MAX = 65;    // Limite superior da zona morta (0-100)

    // --- Mapeamento das direções ---
    const mapeamentoDirecoes = {
        "CENTRO": "Centro",
        "LESTE": "E",
        "OESTE": "O",
        "NORTE": "N",
        "SUL": "S",
        "NORDESTE": "NE",
        "NOROESTE": "NO",
        "SUDESTE": "SE",
        "SUDOESTE": "SO"
    };

    // Seleciona os elementos da rosa dos ventos no HTML
    const direcoesRoseElements = {
        "N": document.querySelector(".wind-rose .north"),
        "NE": document.querySelector(".wind-rose .northeast"),
        "E": document.querySelector(".wind-rose .east"),
        "SE": document.querySelector(".wind-rose .southeast"),
        "S": document.querySelector(".wind-rose .south"),
        "SO": document.querySelector(".wind-rose .southwest"),
        "O": document.querySelector(".wind-rose .west"),
        "NO": document.querySelector(".wind-rose .northwest")
    };

    /**
     * Calcula a direção do joystick baseado nas coordenadas X e Y.
     * Lógica corrigida para mapear corretamente os eixos X e Y.
     * @param {number} x - Posição no eixo X (0-100)
     * @param {number} y - Posição no eixo Y (0-100)
     * @returns {string} - A direção textual ("NORTE", "SUL", "CENTRO", etc.)
     */
    function calcularDirecaoJoystickJS(x, y) {
        const x_dead = (x >= DEAD_ZONE_MIN && x <= DEAD_ZONE_MAX);
        const y_dead = (y >= DEAD_ZONE_MIN && y <= DEAD_ZONE_MAX);

        // Lógica normal e padrão para joystick:
        // X aumenta quando vai para direita -> LESTE
        // X diminui quando vai para esquerda -> OESTE
        // Y aumenta quando vai para baixo -> SUL
        // Y diminui quando vai para cima -> NORTE
        
        const x_leste = (x > DEAD_ZONE_MAX);  // X alto = LESTE (direita)
        const x_oeste = (x < DEAD_ZONE_MIN);  // X baixo = OESTE (esquerda)
        const y_norte = (y < DEAD_ZONE_MIN);  // Y baixo = NORTE (cima)
        const y_sul = (y > DEAD_ZONE_MAX);    // Y alto = SUL (baixo)

        // Centro se ambos estiverem na zona morta
        if (x_dead && y_dead) return "CENTRO";

        // Determinar a direção baseada na combinação de X e Y
        if (y_norte) {
            if (x_oeste) return "NOROESTE";
            if (x_leste) return "NORDESTE";
            return "NORTE";
        }
        
        if (y_sul) {
            if (x_oeste) return "SUDOESTE";
            if (x_leste) return "SUDESTE";
            return "SUL";
        }
        
        // Movimentos apenas horizontais
        if (x_leste) return "LESTE";
        if (x_oeste) return "OESTE";

        return "CENTRO"; // Fallback
    }

    socket.on("novo_dado", function(dado) {
        const statusValorXElement = document.getElementById("x");
        const statusValorYElement = document.getElementById("y");
        const statusDirecaoElement = document.getElementById("direcao");

        let x_val = (dado && typeof dado.x !== 'undefined') ? dado.x : 50;
        let y_val = (dado && typeof dado.y !== 'undefined') ? dado.y : 50;

        statusValorXElement.innerText = x_val;
        statusValorYElement.innerText = y_val;

        let direcaoCalculadaTexto = calcularDirecaoJoystickJS(x_val, y_val);
        let siglaDirecao = mapeamentoDirecoes[direcaoCalculadaTexto] || "--";

        statusDirecaoElement.innerText = (siglaDirecao === "Centro" || siglaDirecao === "--") ? "--" : siglaDirecao;

        // console.log(`X: ${x_val}, Y: ${y_val} -> Direção Texto: ${direcaoCalculadaTexto}, Sigla: ${siglaDirecao}`);

        for (const keySigla in direcoesRoseElements) {
            if (direcoesRoseElements[keySigla]) {
                direcoesRoseElements[keySigla].classList.remove("active");
            }
        }

        if (siglaDirecao && siglaDirecao !== "Centro" && siglaDirecao !== "--" && direcoesRoseElements[siglaDirecao]) {
            direcoesRoseElements[siglaDirecao].classList.add("active");
        } else if (siglaDirecao !== "Centro" && siglaDirecao !== "--") {
            console.warn("Sigla de direção não mapeada para um elemento da rosa dos ventos:", siglaDirecao);
        }
    });
});