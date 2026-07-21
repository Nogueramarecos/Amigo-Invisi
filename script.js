document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // PARTICIPANTES
    // ===============================

    const participantes = [
        "Luján",
        "Luz",
        "Emelyn",
        "Luna",
        "Marcos",
        "Kevin",
        "Ale"
    ];

    // ===============================
    // SEMILLA DEL SORTEO
    // Cambia este número solamente
    // cuando quieras un nuevo sorteo.
    // ===============================

    const semillaSorteo = 20260721;

    // ===============================
    // GENERADOR ALEATORIO CON SEMILLA
    // ===============================

    function randomSeed(seed) {

        return function () {

            seed |= 0;

            seed = seed + 0x6D2B79F5 | 0;

            let t = Math.imul(
                seed ^ seed >>> 15,
                1 | seed
            );

            t ^= t + Math.imul(
                t ^ t >>> 7,
                61 | t
            );

            return (
                (t ^ t >>> 14) >>> 0
            ) / 4294967296;

        };

    }

    // ===============================
    // MEZCLAR
    // ===============================

    function mezclar(lista, rnd) {

        let copia = [...lista];

        for (let i = copia.length - 1; i > 0; i--) {

            let j = Math.floor(
                rnd() * (i + 1)
            );

            [copia[i], copia[j]] =
            [copia[j], copia[i]];

        }

        return copia;

    }

    // ===============================
    // GENERAR SORTEO
    // ===============================

    function generarSorteo() {

        let intento = 0;

        while (true) {

            const rnd =
                randomSeed(
                    semillaSorteo + intento
                );

            const receptores =
                mezclar(participantes, rnd);

            let valido = true;

            for (
                let i = 0;
                i < participantes.length;
                i++
            ) {

                if (
                    participantes[i] === receptores[i]
                ) {
                    valido = false;
                    break;
                }

            }

            if (valido) {

                let asignaciones = {};

                participantes.forEach(
                    (persona, indice) => {

                        asignaciones[persona] =
                            receptores[indice];

                    }
                );

                return asignaciones;

            }

            intento++;

        }

    }

    // ===============================
    // RESULTADO
    // ===============================

    const asignaciones =
        generarSorteo();

    console.log(asignaciones);

    // ===============================
    // CONTROLES
    // ===============================

    const personaSelect =
        document.getElementById(
            "personaSelect"
        );

    const boton =
        document.getElementById(
            "girarBtn"
        );

    const modal =
        document.getElementById(
            "modal"
        );

    const resultado =
        document.getElementById(
            "resultado"
        );

    const cerrar =
        document.getElementById(
            "cerrarBtn"
        );

    const ruleta =
        document.getElementById(
            "ruleta"
        );

    let giro = 0;

    boton.addEventListener("click", () => {

        const persona =
            personaSelect.value;

        if (!persona) {

            alert(
                "Selecciona tu nombre."
            );

            return;

        }

        giro +=
            360 * 6 +
            Math.floor(
                Math.random() * 360
            );

        ruleta.style.transform =
            `rotate(${giro}deg)`;

        setTimeout(() => {

            resultado.textContent =
                asignaciones[persona];

            modal.classList.remove(
                "oculto"
            );

        }, 4000);

    });

    cerrar.addEventListener(
        "click",
        () => {

            modal.classList.add(
                "oculto"
            );

            personaSelect.value = "";

        }
    );

});