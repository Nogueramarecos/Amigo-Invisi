import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    runTransaction,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const participantes = [
    "Luján",
    "Luz",
    "Marcos",
    "Emelyn",
    "Kevin",
    "Luna",
    "Ale"
];


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


const sorteoRef = doc(
    db,
    "sorteos",
    "amigo-invisible-2026"
);


function mezclar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const posicionAleatoria =
            Math.floor(Math.random() * (i + 1));

        [
            copia[i],
            copia[posicionAleatoria]
        ] = [
            copia[posicionAleatoria],
            copia[i]
        ];
    }

    return copia;
}


function crearAsignaciones() {
    let receptores;

    do {
        receptores = mezclar(participantes);
    } while (
        participantes.some(
            (persona, indice) =>
                persona === receptores[indice]
        )
    );

    const asignaciones = {};

    participantes.forEach((persona, indice) => {
        asignaciones[persona] = {
            amigo: receptores[indice],
            visto: false
        };
    });

    return asignaciones;
}


async function prepararSorteo() {
    try {
        const documento = await getDoc(sorteoRef);

        if (!documento.exists()) {
            const asignaciones =
                crearAsignaciones();

            await setDoc(sorteoRef, {
                creado: serverTimestamp(),
                participantes,
                asignaciones
            });

            console.log(
                "Sorteo creado correctamente."
            );
        } else {
            console.log(
                "El sorteo ya existe."
            );
        }
    } catch (error) {
        console.error(
            "Error al preparar el sorteo:",
            error
        );

        mostrarMensaje(
            "No se pudo conectar con Firebase.",
            "error"
        );
    }
}


async function consultarAmigo() {
    const persona = personaSelect.value;

    limpiarMensaje();

    if (!persona) {
        mostrarMensaje(
            "Selecciona tu nombre.",
            "error"
        );

        return;
    }

    verBtn.disabled = true;
    verBtn.textContent = "Consultando...";

    try {
        const amigoAsignado =
            await runTransaction(
                db,
                async transaccion => {

                    const documento =
                        await transaccion.get(
                            sorteoRef
                        );

                    if (!documento.exists()) {
                        throw new Error(
                            "El sorteo todavía no existe."
                        );
                    }

                    const datos =
                        documento.data();

                    const participante =
                        datos.asignaciones[persona];

                    if (!participante) {
                        throw new Error(
                            "La persona no está registrada."
                        );
                    }

                    if (participante.visto) {
                        throw new Error(
                            "YA_VISTO"
                        );
                    }

                    const asignacionesActualizadas = {
                        ...datos.asignaciones,

                        [persona]: {
                            ...participante,
                            visto: true,
                            fechaVista:
                                new Date().toISOString()
                        }
                    };

                    transaccion.update(
                        sorteoRef,
                        {
                            asignaciones:
                                asignacionesActualizadas
                        }
                    );

                    return participante.amigo;
                }
            );

        mostrarResultado(amigoAsignado);

        mostrarMensaje(
            "Tu resultado quedó registrado.",
            "correcto"
        );

    } catch (error) {
        console.error(error);

        if (error.message === "YA_VISTO") {
            mostrarMensaje(
                "Este nombre ya consultó su amigo invisible.",
                "error"
            );
        } else {
            mostrarMensaje(
                "No se pudo consultar el resultado.",
                "error"
            );
        }
    } finally {
        verBtn.disabled = false;

        verBtn.textContent =
            "Ver mi amigo invisible";
    }
}


function mostrarResultado(nombre) {
    resultado.textContent = nombre;

    modal.classList.remove("oculto");
}


function cerrarModal() {
    modal.classList.add("oculto");

    resultado.textContent = "";
    personaSelect.value = "";
}


function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}


function limpiarMensaje() {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
}


verBtn.addEventListener(
    "click",
    consultarAmigo
);

cerrarBtn.addEventListener(
    "click",
    cerrarModal
);

modal.addEventListener(
    "click",
    evento => {
        if (evento.target === modal) {
            cerrarModal();
        }
    }
);


prepararSorteo();