// Lista inicial de jugadores para que la página no empiece vacía
let jugadores = [
    { nombre: "danjaxxx", puntos: 250, espada: "HT1", parkour: "HT2" },
    { nombre: "v3ng3anc3__", puntos: 170, espada: "HT3", parkour: "LT1" },
    { nombre: "vertbloxd", puntos: 161, espada: "LT1", parkour: "LT2" }
];

// Función para renderizar el podio y la tabla entera
function actualizarTabla() {
    // Ordenar automáticamente de mayor a menor puntaje
    jugadores.sort((a, b) => b.puntos - a.puntos);

    // Actualizar el Podio (Top 3)
    if(jugadores[0]) {
        document.getElementById("name-1").innerText = jugadores[0].nombre;
        document.getElementById("points-1").innerText = jugadores[0].puntos + " pts";
    }
    if(jugadores[1]) {
        document.getElementById("name-2").innerText = jugadores[1].nombre;
        document.getElementById("points-2").innerText = jugadores[1].puntos + " pts";
    }
    if(jugadores[2]) {
        document.getElementById("name-3").innerText = jugadores[2].nombre;
        document.getElementById("points-3").innerText = jugadores[2].puntos + " pts";
    }

    // Actualizar la Tabla de abajo
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = ""; // Limpiar tabla vieja

    jugadores.forEach((jugador, index) => {
        const fila = `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${jugador.nombre}</td>
                <td style="color: #ff4500; font-weight: bold;">${jugador.puntos} pts</td>
                <td><span class="badge">${jugador.espada}</span></td>
                <td><span class="badge">${jugador.parkour}</span></td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// Función para añadir infinitos jugadores desde el panel web
function agregarJugador() {
    const nombre = document.getElementById("playerName").value;
    const puntos = parseInt(document.getElementById("playerPoints").value);
    const espada = document.getElementById("swordTier").value;
    const parkour = document.getElementById("parkourTier").value;

    if(nombre && puntos) {
        jugadores.push({ nombre, puntos, espada, parkour });
        actualizarTabla(); // Recalcula posiciones y podio automáticamente
        
        // Limpiar formulario
        document.getElementById("playerName").value = "";
        document.getElementById("playerPoints").value = "";
        document.getElementById("swordTier").value = "";
        document.getElementById("parkourTier").value = "";
    } else {
        alert("Mínimo pon el nombre y los puntos, bro.");
    }
}

// Ejecutar al cargar la página por primera vez
actualizarTabla();
