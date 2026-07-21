document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // PARTICIPANTES
    // ========================================

    const participantes = [
        "Luján",
        "Luz",
        "Emelyn",
        "Luna",
        "Marcos",
        "Kevin",
        "Ale"
    ];

    /*
        Todos los dispositivos generan las mismas
        asignaciones mientras la semilla no cambie.
    */

    const semillaSorteo = 20260721;

    // ========================================
    // GENERADOR ALEATORIO CON SEMILLA
    // ========================================

    function crearGeneradorAleatorio(semilla) {
        return function () {
            semilla |= 0;
            semilla = semilla + 0x6D2B79F5 | 0;

            let resultado = Math.imul(
                semilla ^ semilla >>> 15,
                1 | semilla
            );

            resultado =
                resultado +
                Math.imul(
                    resultado ^ resultado >>> 7,
                    61 | resultado
                ) ^ resultado;

            return (
                (resultado ^ resultado >>> 14) >>> 0
            ) / 4294967296;
        };
    }

    // ========================================
    // MEZCLAR LISTA
    // ========================================

    function mezclarLista(lista, aleatorio) {
        const copia = [...lista];

        for (
            let indice = copia.length - 1;
            indice > 0;
            indice--
        ) {
            const posicion = Math.floor(
                aleatorio() * (indice + 1)
            );

            [
                copia[indice],
                copia[posicion]
            ] = [
                copia[posicion],
                copia[indice]
            ];
        }

        return copia;
    }

    // ========================================
    // GENERAR SORTEO
    // ========================================

    function generarSorteo() {
        if (participantes.length < 2) {
            throw new Error(
                "Se necesitan al menos dos participantes."
            );
        }

        let intento = 0;

        while (intento < 10000) {
            const aleatorio =
                crearGeneradorAleatorio(
                    semillaSorteo + intento
                );

            const receptores =
                mezclarLista(
                    participantes,
                    aleatorio
                );

            const nadieSeToca =
                participantes.every(
                    function (persona, indice) {
                        return (
                            persona !==
                            receptores[indice]
                        );
                    }
                );

            const sinRepetidos =
                new Set(receptores).size ===
                participantes.length;

            if (nadieSeToca && sinRepetidos) {
                const asignaciones = {};

                participantes.forEach(
                    function (persona, indice) {
                        asignaciones[persona] =
                            receptores[indice];
                    }
                );

                return asignaciones;
            }

            intento++;
        }

        throw new Error(
            "No fue posible generar un sorteo válido."
        );
    }

    const asignaciones = generarSorteo();

    // ========================================
    // ELEMENTOS
    // ========================================

    const nombreInput =
        document.getElementById("nombreInput");

    const girarBtn =
        document.getElementById("girarBtn");

    const mensaje =
        document.getElementById("mensaje");

    const ruleta =
        document.getElementById("ruleta");

    const centroRuleta =
        document.getElementById("centroRuleta");

    const modal =
        document.getElementById("modal");

    const resultado =
        document.getElementById("resultado");

    const cerrarBtn =
        document.getElementById("cerrarBtn");

    let gradosActuales = 0;
    let girando = false;

    // ========================================
    // NORMALIZAR NOMBRES
    // Permite escribir:
    // Luján, LUJAN, luján, etc.
    // ========================================

    function normalizarTexto(texto) {
        return texto
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function buscarParticipante(nombreEscrito) {
        const nombreNormalizado =
            normalizarTexto(nombreEscrito);

        return participantes.find(
            function (participante) {
                return (
                    normalizarTexto(participante) ===
                    nombreNormalizado
                );
            }
        );
    }

    // ========================================
    // GIRAR RULETA
    // ========================================

    girarBtn.addEventListener("click", function () {
        if (girando) {
            return;
        }

        const nombreEscrito =
            nombreInput.value.trim();

        limpiarMensaje();

        if (!nombreEscrito) {
            mostrarError(
                "Escribe tu nombre antes de girar."
            );

            nombreInput.focus();
            return;
        }

        const persona =
            buscarParticipante(nombreEscrito);

        if (!persona) {
            mostrarError(
                "Ese nombre no se encuentra entre los participantes."
            );

            nombreInput.select();
            return;
        }

        if (!asignaciones[persona]) {
            mostrarError(
                "No se encontró una asignación para ese participante."
            );

            return;
        }

        iniciarGiro(persona);
    });

    nombreInput.addEventListener(
        "keydown",
        function (evento) {
            if (evento.key === "Enter") {
                girarBtn.click();
            }
        }
    );

    function iniciarGiro(persona) {
        girando = true;

        girarBtn.disabled = true;
        nombreInput.disabled = true;

        centroRuleta.textContent = "🎲";

        const vueltas =
            6 + Math.floor(Math.random() * 3);

        const posicionFinal =
            Math.floor(Math.random() * 360);

        gradosActuales +=
            vueltas * 360 +
            posicionFinal;

        ruleta.style.transform =
            `rotate(${gradosActuales}deg)`;

        setTimeout(function () {
            centroRuleta.textContent = "🎁";

            resultado.textContent =
                asignaciones[persona];

            modal.classList.remove("oculto");

            girando = false;
        }, 4100);
    }

    // ========================================
    // CERRAR MODAL
    // ========================================

    cerrarBtn.addEventListener(
        "click",
        cerrarModal
    );

    modal.addEventListener(
        "click",
        function (evento) {
            if (evento.target === modal) {
                cerrarModal();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function (evento) {
            if (
                evento.key === "Escape" &&
                !modal.classList.contains("oculto")
            ) {
                cerrarModal();
            }
        }
    );

    function cerrarModal() {
        modal.classList.add("oculto");

        resultado.textContent = "";

        nombreInput.value = "";
        nombreInput.disabled = false;

        girarBtn.disabled = false;

        centroRuleta.textContent = "🎲";

        limpiarMensaje();

        nombreInput.focus();
    }

    // ========================================
    // MENSAJES
    // ========================================

    function mostrarError(texto) {
        mensaje.textContent = texto;
        mensaje.className = "mensaje error";
    }

    function limpiarMensaje() {
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }

});