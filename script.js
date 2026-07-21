document.addEventListener("DOMContentLoaded", function () {

    // Solo debes escribir la lista de participantes.
    const participantes = [
        "Luján",
        "Luz",
        "Marcos",
        "Emelyn",
        "Kevin",
        "Luna",
        "Ale"
    ];

    /*
        Cambia este número para realizar un nuevo sorteo.
        Usando el mismo número, todos obtienen el mismo resultado.
    */
    const semillaSorteo = 20260721;

    function crearGeneradorAleatorio(semilla) {
        return function () {
            semilla |= 0;
            semilla = semilla + 0x6D2B79F5 | 0;

            let resultado = Math.imul(
                semilla ^ semilla >>> 15,
                1 | semilla
            );

            resultado = resultado + Math.imul(
                resultado ^ resultado >>> 7,
                61 | resultado
            ) ^ resultado;

            return (
                (resultado ^ resultado >>> 14) >>> 0
            ) / 4294967296;
        };
    }

    function mezclarNombres(lista, aleatorio) {
        const copia = [...lista];

        for (let i = copia.length - 1; i > 0; i--) {
            const posicion = Math.floor(
                aleatorio() * (i + 1)
            );

            [copia[i], copia[posicion]] =
                [copia[posicion], copia[i]];
        }

        return copia;
    }

    function generarSorteo() {
        let intento = 0;

        while (intento < 1000) {
            const aleatorio = crearGeneradorAleatorio(
                semillaSorteo + intento
            );

            const receptores = mezclarNombres(
                participantes,
                aleatorio
            );

            const sorteoValido = participantes.every(
                function (persona, indice) {
                    return persona !== receptores[indice];
                }
            );

            if (sorteoValido) {
                const sorteo = {};

                participantes.forEach(
                    function (persona, indice) {
                        sorteo[persona] = receptores[indice];
                    }
                );

                return sorteo;
            }

            intento++;
        }

        throw new Error(
            "No se pudo generar un sorteo válido."
        );
    }

    const sorteo = generarSorteo();

    const personaSelect =
        document.getElementById("personaSelect");

    const verBtn =
        document.getElementById("verBtn");

    const mensaje =
        document.getElementById("mensaje");

    const modal =
        document.getElementById("modal");

    const resultado =
        document.getElementById("resultado");

    const cerrarBtn =
        document.getElementById("cerrarBtn");

    verBtn.addEventListener("click", function () {
        const persona = personaSelect.value;

        mensaje.textContent = "";
        mensaje.className = "mensaje";

        if (!persona) {
            mensaje.textContent =
                "Selecciona tu nombre.";

            mensaje.classList.add("error");
            return;
        }

        const amigoAsignado = sorteo[persona];

        if (!amigoAsignado) {
            mensaje.textContent =
                "No se encontró el participante.";

            mensaje.classList.add("error");
            return;
        }

        resultado.textContent = amigoAsignado;
        modal.classList.remove("oculto");
    });

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

    function cerrarModal() {
        modal.classList.add("oculto");
        resultado.textContent = "";
        personaSelect.value = "";
    }

});