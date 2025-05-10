document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    // --- Configurações do Joystick (replicadas do seu código C) ---
    const DEAD_ZONE_MIN = 35;    // Limite inferior da zona morta (0-100)
    const DEAD_ZONE_MAX = 65;    // Limite superior da zona morta (0-100)

    // --- Mapeamento das direções ---
    // As CHAVES aqui são as strings que a nossa nova função calcularDirecaoJoystickJS vai retornar.
    // Os VALORES são as siglas que queremos mostrar na tela e usar para as classes CSS da rosa dos ventos.
    const mapeamentoDirecoes = {
        "CENTRO": "Centro", // Ou apenas "--" se preferir não mostrar "Centro"
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
    // As CHAVES aqui devem ser as SIGLAS (N, NE, E, etc.)
    const direcoesRoseElements = {
        "N": document.querySelector(".wind-rose .north"),
        "NE": document.querySelector(".wind-rose .northeast"),
        "E": document.querySelector(".wind-rose .east"),
        "SE": document.querySelector(".wind-rose .southeast"),
        "S": document.querySelector(".wind-rose .south"),
        "SO": document.querySelector(".wind-rose .southwest"),
        "O": document.querySelector(".wind-rose .west"),
        "NO": document.querySelector(".wind-rose .northwest")
        // Não precisamos de "Centro" aqui, pois só destacamos direções ativas
    };

    /**
     * Calcula a direção do joystick baseado nas coordenadas X e Y.
     * Lógica adaptada do seu código C e AJUSTADA CONFORME O FEEDBACK.
     * @param {number} x - Posição no eixo X (0-100)
     * @param {number} y - Posição no eixo Y (0-100)
     * @returns {string} - A direção textual ("NORTE", "SUL", "CENTRO", etc.)
     */
    function calcularDirecaoJoystickJS(x, y) {
        const x_fisico_dead = (x >= DEAD_ZONE_MIN && x <= DEAD_ZONE_MAX);
        const y_fisico_dead = (y >= DEAD_ZONE_MIN && y <= DEAD_ZONE_MAX);


        // SE X < DEAD_ZONE_MIN (físico ESQUERDA) -> NORTE
        const x_para_norte = (x > DEAD_ZONE_MIN);
        // SE X > DEAD_ZONE_MAX (físico DIREITA) -> SUL
        const x_para_sul = (x < DEAD_ZONE_MAX);

        const y_para_leste = (y < DEAD_ZONE_MAX); // Y alto (cima) -> Leste
        // Se "para BAIXO (físico Y) vai pro OESTE":
        const y_para_oeste = (y > DEAD_ZONE_MIN); // Y baixo (baixo) -> Oeste


        if (x_fisico_dead && y_fisico_dead) return "CENTRO";

        // Priorizando movimentos primários (N, S, E, O) e depois diagonais
        // Baseado na ideia de que X controla Norte/Sul e Y controla Leste/Oeste

        if (x_para_norte) { // Movimento físico para Esquerda (resultando em Norte)
            if (y_para_leste) return "NORDESTE";  // Esquerda-Cima
            if (y_para_oeste) return "NOROESTE";   // Esquerda-Baixo
            return "NORTE";                       // Esquerda
        }
        if (x_para_sul) {   // Movimento físico para Direita (resultando em Sul)
            if (y_para_leste) return "SUDESTE";   // Direita-Cima
            if (y_para_oeste) return "SUDOESTE";  // Direita-Baixo
            return "SUL";                         // Direita
        }
        // Apenas movimentos no eixo Y físico (resultando em Leste/Oeste)
        if (y_para_leste) return "LESTE";     // Cima
        if (y_para_oeste) return "OESTE";     // Baixo

        return "CENTRO"; // Fallback
    }

    socket.on("novo_dado", function(dado) {
        const statusValorXElement = document.getElementById("x");
        const statusValorYElement = document.getElementById("y");
        const statusDirecaoElement = document.getElementById("direcao");

        // Assume que 'dado' terá as chaves 'x' e 'y' (e talvez 'button')
        let x_val = (dado && typeof dado.x !== 'undefined') ? dado.x : 50; // Padrão para centro
        let y_val = (dado && typeof dado.y !== 'undefined') ? dado.y : 50; // Padrão para centro

        statusValorXElement.innerText = x_val;
        statusValorYElement.innerText = y_val;

        // 1. Calcular a direção AQUI no JavaScript
        let direcaoCalculadaTexto = calcularDirecaoJoystickJS(x_val, y_val); // Ex: "NORTE", "SUL", etc.

        // 2. Usar o mapeamento para obter a sigla (N, S, E, etc.)
        let siglaDirecao = mapeamentoDirecoes[direcaoCalculadaTexto] || "--";

        // 3. Atualizar o texto da direção na página
        statusDirecaoElement.innerText = (siglaDirecao === "Centro" || siglaDirecao === "--") ? "--" : siglaDirecao;

        // DEBUG: Verifique os valores no console
        // console.log(`X: ${x_val}, Y: ${y_val} -> Direção Texto: ${direcaoCalculadaTexto}, Sigla: ${siglaDirecao}`);

        // 4. Atualizar a rosa dos ventos
        // Primeiro, remove a classe 'active' de todas as direções
        for (const keySigla in direcoesRoseElements) { // Itera sobre as SIGLAS N, NE, E...
            if (direcoesRoseElements[keySigla]) {
                direcoesRoseElements[keySigla].classList.remove("active");
            }
        }

        // Depois, adiciona a classe 'active' à direção atual (usando a SIGLA)
        // Verifica se a siglaDirecao existe como chave em direcoesRoseElements
        if (siglaDirecao && siglaDirecao !== "Centro" && siglaDirecao !== "--" && direcoesRoseElements[siglaDirecao]) {
            direcoesRoseElements[siglaDirecao].classList.add("active");
        } else if (siglaDirecao !== "Centro" && siglaDirecao !== "--") {
            // Este log pode aparecer se a siglaDirecao for algo que não tem um elemento correspondente
            console.warn("Sigla de direção não mapeada para um elemento da rosa dos ventos:", siglaDirecao);
        }
    }); // Fim do socket.on("novo_dado")
}); // Fim do document.addEventListener("DOMContentLoaded")