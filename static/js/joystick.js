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
     * Lógica adaptada do seu código C.
     * @param {number} x - Posição no eixo X (0-100)
     * @param {number} y - Posição no eixo Y (0-100)
     * @returns {string} - A direção textual ("NORTE", "SUL", "CENTRO", etc.)
     */
    function calcularDirecaoJoystickJS(x, y) {
        const x_dead = (x >= DEAD_ZONE_MIN && x <= DEAD_ZONE_MAX);
        const y_dead = (y >= DEAD_ZONE_MIN && y <= DEAD_ZONE_MAX);

        // IMPORTANTE: No seu código C, parece que y_pos (Y > MAX) é NORTE
        // e y_neg (Y < MIN) é SUL. Isso pode ser o contrário do que se espera
        // em um sistema de coordenadas de tela onde Y cresce para baixo.
        // Verifique se a orientação está correta para o seu caso visual.
        //
        // Assumindo a lógica do seu C:
        // Y > MAX (y_pos no C) = NORTE (para cima)
        // Y < MIN (y_neg no C) = SUL (para baixo)
        // X > MAX (x_pos no C) = LESTE (direita)
        // X < MIN (x_neg no C) = OESTE (esquerda)
        //
        // SE no seu joystick VISUALMENTE "para cima" (NORTE) corresponde a um Y MENOR (perto de 0),
        // então as condições de Y precisam ser invertidas em relação ao seu código C.
        // O código abaixo segue a lógica como está no seu C. Ajuste se necessário!

        // Exemplo de lógica INVERTIDA para Y se necessário:
        const y_para_norte = (y < DEAD_ZONE_MIN); // Y menor significa "para cima" (NORTE)
        const y_para_sul = (y > DEAD_ZONE_MAX);   // Y maior significa "para baixo" (SUL)
        const x_para_leste = (x > DEAD_ZONE_MAX); // Equivalente ao x_pos do C
        const x_para_oeste = (x < DEAD_ZONE_MIN); // Equivalente ao x_neg do C

        if (x_dead && y_dead) return "CENTRO";

        if (y_para_norte) { // "Para cima"
            if (x_para_oeste) return "NOROESTE";   // Cima-esquerda
            if (x_para_leste) return "NORDESTE";  // Cima-direita
            return "NORTE";                       // Cima
        }
        if (y_para_sul) {   // "Para baixo"
            if (x_para_oeste) return "SUDOESTE";  // Baixo-esquerda
            if (x_para_leste) return "SUDESTE";   // Baixo-direita
            return "SUL";                         // Baixo
        }
        // Apenas movimentos laterais
        if (x_para_leste) return "LESTE";     // Direita
        if (x_para_oeste) return "OESTE";     // Esquerda

        return "CENTRO"; // Fallback, caso algo não se encaixe
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