document.addEventListener("DOMContentLoaded", function () {

    const sorteo = {
        "Luján": "Kevin",
        "Luz": "Ale",
        "Marcos": "Luján",
        "Emelyn": "Luna",
        "Kevin": "Emelyn",
        "Luna": "Marcos",
        "Ale": "Luz"
    };

    const personaSelect = document.getElementById("personaSelect");
    const verBtn = document.getElementById("verBtn");
    const mensaje = document.getElementById("mensaje");
    const modal = document.getElementById("modal");
    const resultado = document.getElementById("resultado");
    const cerrarBtn = document.getElementById("cerrarBtn");

    verBtn.addEventListener("click", function () {
        const persona = personaSelect.value;

        mensaje.textContent = "";
        mensaje.className = "mensaje";

        if (!persona) {
            mensaje.textContent = "Selecciona tu nombre.";
            mensaje.classList.add("error");
            return;
        }

        resultado.textContent = sorteo[persona];
        modal.classList.remove("oculto");
    });

    cerrarBtn.addEventListener("click", function () {
        modal.classList.add("oculto");
        resultado.textContent = "";
        personaSelect.value = "";
    });

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            modal.classList.add("oculto");
            resultado.textContent = "";
            personaSelect.value = "";
        }
    });

});