document.addEventListener("DOMContentLoaded", function () {

    const participantes = [
        "Luján",
        "Luz",
        "Emelyn",
        "Luna",
        "Marcos",
        "Kevin",
        "Ale"
    ];

    function elegirAleatorio(lista) {
        const indice = Math.floor(Math.random() * lista.length);
        return lista[indice];
    }

    function asignarAmigoInvisible(listaParticipantes) {
        const asignaciones = {};
        const candidatos = [...listaParticipantes];

        for (const nombre of listaParticipantes) {

            const posibles = candidatos.filter(
                candidato => candidato !== nombre
            );

            if (posibles.length === 0) {
                return asignarAmigoInvisible(listaParticipantes);
            }

            const elegido = elegirAleatorio(posibles);

            asignaciones[nombre] = elegido;

            const posicion = candidatos.indexOf(elegido);

            if (posicion !== -1) {
                candidatos.splice(posicion, 1);
            }
        }

        return asignaciones;
    }

    /*
        Se genera una sola vez cuando carga la página.
    */
    const sorteo = asignarAmigoInvisible(participantes);

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
            mensaje.textContent = "Selecciona tu nombre.";
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

    cerrarBtn.addEventListener("click", cerrarModal);

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            cerrarModal();
        }
    });

    function cerrarModal() {
        modal.classList.add("oculto");
        resultado.textContent = "";
        personaSelect.value = "";
    }

});