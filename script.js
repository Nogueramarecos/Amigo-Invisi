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

function consultarAmigo() {
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
        mensaje.textContent = "No se encontró el participante.";
        mensaje.classList.add("error");
        return;
    }

    resultado.textContent = amigoAsignado;
    modal.classList.remove("oculto");
}

function cerrarModal() {
    modal.classList.add("oculto");
    resultado.textContent = "";
    personaSelect.value = "";
}

verBtn.addEventListener("click", consultarAmigo);
cerrarBtn.addEventListener("click", cerrarModal);

modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
        cerrarModal();
    }
});