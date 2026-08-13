// Database template (Will be connected to Firebase later)
let jugadores = [
    { nombre: "danjaxxx", puntos: 250, region: "NA", sword: "LT1", enchanted: "HT1", skywars: "HT2", bedwars: "HT1", pot: "HT1", hole: "HT1", uhc: "HT1", soup: "HT1", parkour: "HT2" },
    { nombre: "v3ng3anc3__", puntos: 170, region: "EU", sword: "HT1", enchanted: "HT3", skywars: "LT1", bedwars: "HT3", pot: "LT1", hole: "HT2", uhc: "HT2", soup: "LT1", parkour: "LT1" },
    { nombre: "vertbloxd", puntos: 161, region: "NA", sword: "LT3", enchanted: "LT1", skywars: "LT2", bedwars: "LT1", pot: "LT2", hole: "LT1", uhc: "LT1", soup: "LT2", parkour: "LT2" }
];

let modoActual = 'overall';
let regionActual = 'ALL';
let busquedaActual = '';

function cambiarModo(nuevoModo) {
    modoActual = nuevoModo;
    document.querySelectorAll('#modo-menu .filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    actualizarLeaderboard();
}

function cambiarRegion(nuevaRegion) {
    regionActual = nuevaRegion;
    document.querySelectorAll('#region-menu .filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    actualizarLeaderboard();
}

// Logic to search players dynamically
function buscarJugador() {
    busquedaActual = document.getElementById("playerSearch").value.toLowerCase().trim();
    actualizarLeaderboard();
}

function actualizarLeaderboard() {
    // 1. Filter by Region and Filter by Search Query at the same time
    let filtrados = jugadores.filter(j => {
        let matchRegion = regionActual === 'ALL' || j.region === regionActual;
        let matchSearch = j.nombre.toLowerCase().includes(busquedaActual);
        return matchRegion && matchSearch;
    });

    // 2. Sort from highest points to lowest
    filtrados.sort((a, b) => b.puntos - a.puntos);

    // 3. Update the Top 3 Podium
    document.getElementById("name-1").innerText = filtrados[0] ? filtrados[0].nombre : "-";
    document.getElementById("points-1").innerText = filtrados[0] ? (modoActual === 'overall' ? filtrados[0].puntos + " pts" : "Tier: " + filtrados[0][modoActual]) : "0 pts";

    document.getElementById("name-2").innerText = filtrados[1] ? filtrados[1].nombre : "-";
    document.getElementById("points-2").innerText = filtrados[1] ? (modoActual === 'overall' ? filtrados[1].puntos + " pts" : "Tier: " + filtrados[1][modoActual]) : "0 pts";

    document.getElementById("name-3").innerText = filtrados[2] ? filtrados[2].nombre : "-";
    document.getElementById("points-3").innerText = filtrados[2] ? (modoActual === 'overall' ? filtrados[2].puntos + " pts" : "Tier: " + filtrados[2][modoActual]) : "0 pts";

    // 4. Build Table Rows
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    filtrados.forEach((jugador, index) => {
        let rangoMostrado = modoActual === 'overall' ? 'All Modes Overall' : jugador[modoActual] || 'N/A';
        const fila = `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${jugador.nombre}</td>
                <td><span style="color: #6b7280;">${jugador.region}</span></td>
                <td style="color: #50c878; font-weight: bold;">${jugador.puntos} pts</td>
                <td><span style="color: #a78bfa; font-weight: bold;">${rangoMostrado}</span></td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

actualizarLeaderboard();
