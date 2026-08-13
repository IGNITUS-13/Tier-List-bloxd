// Base de datos de ejemplo con las regiones y modos correctos
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

function buscarJugador() {
    busquedaActual = document.getElementById("playerSearch").value.toLowerCase().trim();
    actualizarLeaderboard();
}

function actualizarLeaderboard() {
    let filtrados = jugadores.filter(j => {
        let matchRegion = regionActual === 'ALL' || j.region === regionActual;
        let matchSearch = j.nombre.toLowerCase().includes(busquedaActual);
        return matchRegion && matchSearch;
    });

    filtrados.sort((a, b) => b.puntos - a.puntos);

    document.getElementById("name-1").innerText = filtrados[0] ? filtrados[0].nombre : "-";
    document.getElementById("points-1").innerText = filtrados[0] ? (modoActual === 'overall' ? filtrados[0].puntos + " pts" : "Tier: " + filtrados[0][modoActual]) : "0 pts";

    document.getElementById("name-2").innerText = filtrados[1] ? filtrados[1].nombre : "-";
    document.getElementById("points-2").innerText = filtrados[1] ? (modoActual === 'overall' ? filtrados[1].puntos + " pts" : "Tier: " + filtrados[1][modoActual]) : "0 pts";

    document.getElementById("name-3").innerText = filtrados[2] ? filtrados[2].nombre : "-";
    document.getElementById("points-3").innerText = filtrados[2] ? (modoActual === 'overall' ? filtrados[2].puntos + " pts" : "Tier: " + filtrados[2][modoActual]) : "0 pts";

    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    filtrados.forEach((jugador, index) => {
        let contenidoRango = '';

        // SI EL MODO ES OVERALL, DIBUJA TODOS LOS TIERS CON SUS ÍCONOS
        if (modoActual === 'overall') {
            contenidoRango = `
                <div class="all-tiers-container" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">⚔️ ${jugador.sword}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">✨ ${jugador.enchanted}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">☁️ ${jugador.skywars}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🛏️ ${jugador.bedwars}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🧪 ${jugador.pot}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🕳️ ${jugador.hole}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🍎 ${jugador.uhc}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🍲 ${jugador.soup}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🏃 ${jugador.parkour}</span>
                </div>
            `;
        } else {
            // SI SELECCIONAS UN MODO INDIVIDUAL, SOLO MUESTRA ESE TIER
            contenidoRango = `<span style="color: #a78bfa; font-weight: bold; background: #1c1a27; padding: 6px 12px; border-radius: 4px; border: 1px solid #3c2a6b;">${jugador[modoActual] || 'N/A'}</span>`;
        }

        const fila = `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${jugador.nombre}</td>
                <td><span style="color: #6b7280;">${jugador.region}</span></td>
                <td style="color: #50c878; font-weight: bold;">${jugador.puntos} pts</td>
                <td>${contenidoRango}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

actualizarLeaderboard();
