let jugadores = [
    { nombre: "danjaxxx", puntos: 250, region: "NA", sword: "LT1", enchanted: "HT1", skywars: "HT2", bedwars: "HT1", pot: "HT1", hole: "HT1", uhc: "HT1", soup: "HT1", parkour: "HT2" },
    { nombre: "v3ng3anc3__", puntos: 170, region: "EU", sword: "HT1", enchanted: "HT3", skywars: "LT1", bedwars: "HT3", pot: "LT1", hole: "HT2", uhc: "HT2", soup: "LT1", parkour: "LT1" },
    { nombre: "vertbloxd", puntos: 161, region: "NA", sword: "LT3", enchanted: "LT1", skywars: "LT2", bedwars: "LT1", pot: "LT2", hole: "LT1", uhc: "LT1", soup: "LT2", parkour: "LT2" }
];

let modoActual = 'overall';
let regionActual = 'ALL';

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

function actualizarLeaderboard() {
    let filtrados = jugadores.filter(j => regionActual === 'ALL' || j.region === regionActual);
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
        let rangoMostrado = modoActual === 'overall' ? 'Todos los Modos' : jugador[modoActual] || 'N/A';
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

function agregarJugador() {
    const nombre = document.getElementById("playerName").value.trim();
    const puntos = parseInt(document.getElementById("playerPoints").value);
    const region = document.getElementById("playerRegion").value;
    const sword = document.getElementById("swordTier").value.trim();
    const enchanted = document.getElementById("enchantedTier").value.trim();
    const skywars = document.getElementById("skywarsTier").value.trim();
    const bedwars = document.getElementById("bedwarsTier").value.trim();
    const pot = document.getElementById("potTier").value.trim();
    const hole = document.getElementById("holeTier").value.trim();
    const uhc = document.getElementById("uhcTier").value.trim();
    const soup = document.getElementById("soupTier").value.trim();
    const parkour = document.getElementById("parkourTier").value.trim();

    if (nombre && !isNaN(puntos)) {
        jugadores.push({ nombre, puntos, region, sword, enchanted, skywars, bedwars, pot, hole, uhc, soup, parkour });
        actualizarLeaderboard();

        document.getElementById("playerName").value = "";
        document.getElementById("playerPoints").value = "";
        document.getElementById("swordTier").value = "";
        document.getElementById("enchantedTier").value = "";
        document.getElementById("skywarsTier").value = "";
        document.getElementById("bedwarsTier").value = "";
        document.getElementById("potTier").value = "";
        document.getElementById("holeTier").value = "";
        document.getElementById("uhcTier").value = "";
        document.getElementById("soupTier").value = "";
        document.getElementById("parkourTier").value = "";
    } else {
        alert("Falta rellenar datos básicos, bro.");
    }
}

actualizarLeaderboard();
