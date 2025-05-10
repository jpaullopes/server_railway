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
     * ESTA VERSÃO VOLTA À LÓGICA ORIGINAL DO SEU C, MAS INVERTE AS COMPARAÇÕES
     * PARA CORRIGIR O COMPORTAMENTO OBSERVADO.
     * @param {number} x - Posição no eixo X (0-100)
     * @param {number} y - Posição no eixo Y (0-100)
     * @returns {string} - A direção textual ("NORTE", "SUL", "CENTRO", etc.)
     */
    function calcularDirecaoJoystickJS(x, y) {
        const x_dead = (x >= DEAD_ZONE_MIN && x <= DEAD_ZONE_MAX);
        const y_dead = (y >= DEAD_ZONE_MIN && y <= DEAD_ZONE_MAX);

        // Comportamento observado:
        // Sobe (Y físico, esperado NORTE) -> SUL => Inverter lógica de Y para NORTE/SUL
        // Desce (Y físico, esperado SUL) -> NORTE => Inverter lógica de Y para NORTE/SUL
        // Direita (X físico, esperado LESTE) -> OESTE => Inverter lógica de X para LESTE/OESTE
        // Esquerda (X físico, esperado OESTE) -> LESTE => Inverter lógica de X para LESTE/OESTE

        // Lógica ORIGINAL do seu C (y_pos > MAX = NORTE, y_neg < MIN = SUL):
        // bool y_pos = (y > DEAD_ZONE_MAX); // No C, isso era NORTE
        // bool y_neg = (y < DEAD_ZONE_MIN); // No C, isso era SUL
        // bool x_pos = (x > DEAD_ZONE_MAX); // No C, isso era LESTE
        // bool x_neg = (x < DEAD_ZONE_MIN); // No C, isso era OESTE

        // INVERTENDO as condições para o JavaScript:
        // Se no C "Y > MAX" era NORTE, e agora está dando SUL, então para dar NORTE no JS, precisamos de "Y < MIN"
        const y_para_norte = (y > DEAD_ZONE_MIN); // Se Y físico DESCE (valor menor), queremos NORTE
        const y_para_sul = (y < DEAD_ZONE_MAX);   // Se Y físico SOBE (valor maior), queremos SUL

        // Se no C "X > MAX" era LESTE, e agora está dando OESTE, então para dar LESTE no JS, precisamos de "X < MIN"
        const x_para_leste = (x > DEAD_ZONE_MIN); // Se X físico vai para ESQUERDA (valor menor), queremos LESTE
        const x_para_oeste = (x < DEAD_ZONE_MAX);  // Se X físico vai para DIREITA (valor maior), queremos OESTE


        if (x_dead && y_dead) return "CENTRO";

        if (y_para_norte) { // Esperado NORTE
            if (x_para_oeste) return "NOROESTE";
            if (x_para_leste) return "NORDESTE";
            return "NORTE";
        }
        if (y_para_sul) {   // Esperado SUL
            if (x_para_oeste) return "SUDOESTE";
            if (x_para_leste) return "SUDESTE";
            return "SUL";
        }
        // Apenas movimentos laterais
        if (x_para_leste) return "LESTE";
        if (x_para_oeste) return "OESTE";

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