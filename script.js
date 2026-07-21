document.addEventListener("DOMContentLoaded", () => {

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
    const modal = document.getElementById("modal");
    const resultado = document.getElementById("resultado");
    const cerrarBtn = document.getElementById("cerrarBtn");
    const mensaje = document.getElementById("mensaje");

    verBtn.onclick = function () {

        mensaje.textContent = "";

        const persona = personaSelect.value;

        if (persona === "") {
            mensaje.textContent = "Selecciona un nombre.";
            return;
        }

        resultado.textContent = sorteo[persona];

        modal.classList.remove("oculto");
    };

    cerrarBtn.onclick = function () {

        modal.classList.add("oculto");

        personaSelect.selectedIndex = 0;
    };

    modal.onclick = function(e){

        if(e.target === modal){

            modal.classList.add("oculto");

            personaSelect.selectedIndex = 0;

        }

    };

});