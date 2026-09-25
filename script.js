import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCENRrHraChbm304WpJ4TsP3Qr4gSUChNI",
    authDomain: "bloxd-pvp-tierlist.firebaseapp.com",
    databaseURL: "https://bloxd-pvp-tierlist-default-rtdb.firebaseio.com",
    projectId: "bloxd-pvp-tierlist",
    storageBucket: "bloxd-pvp-tierlist.firebasestorage.app",
    messagingSenderId: "15316171096",
    appId: "1:15316171096:web:e3c0bdc1238dd8e6dfcd2d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let jugadores = [];
let modoActual = 'overall';
let regionActual = 'ALL';
let busquedaActual = '';

function cambiarModo(nuevoModo, boton) {
    modoActual = nuevoModo;
    document.querySelectorAll('#modo-menu .filter-btn').forEach(btn => btn.classList.remove('active'));
    if (boton) boton.classList.add('active');
    actualizarLeaderboard();
}

function cambiarRegion(nuevaRegion, boton) {
    regionActual = nuevaRegion;
    document.querySelectorAll('#region-menu .filter-btn').forEach(btn => btn.classList.remove('active'));
    if (boton) boton.classList.add('active');
    actualizarLeaderboard();
}

function buscarJugador() {
    busquedaActual = document.getElementById("playerSearch").value.toLowerCase().trim();
    actualizarLeaderboard();
}

function actualizarLeaderboard() {
    let filtrados = jugadores.filter(j => {
        const nombre = String(j.nombre || '');
        const matchRegion = regionActual === 'ALL' || j.region === regionActual;
        const matchSearch = nombre.toLowerCase().includes(busquedaActual);
        return matchRegion && matchSearch;
    });

    filtrados.sort((a, b) => Number(b.puntos || 0) - Number(a.puntos || 0));

    document.getElementById("name-1").innerText = filtrados[0] ? filtrados[0].nombre : "-";
    document.getElementById("points-1").innerText = filtrados[0] ? (modoActual === 'overall' ? filtrados[0].puntos + " pts" : "Tier: " + (filtrados[0][modoActual] || "N/A")) : "0 pts";

    document.getElementById("name-2").innerText = filtrados[1] ? filtrados[1].nombre : "-";
    document.getElementById("points-2").innerText = filtrados[1] ? (modoActual === 'overall' ? filtrados[1].puntos + " pts" : "Tier: " + (filtrados[1][modoActual] || "N/A")) : "0 pts";

    document.getElementById("name-3").innerText = filtrados[2] ? filtrados[2].nombre : "-";
    document.getElementById("points-3").innerText = filtrados[2] ? (modoActual === 'overall' ? filtrados[2].puntos + " pts" : "Tier: " + (filtrados[2][modoActual] || "N/A")) : "0 pts";

    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "";

    filtrados.forEach((jugador, index) => {
        let contenidoRango = '';

        if (modoActual === 'overall') {
            contenidoRango = `
                <div class="all-tiers-container" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">⚔️ ${jugador.sword || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">✨ ${jugador.enchanted || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">☁️ ${jugador.skywars || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🛏️ ${jugador.bedwars || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🧪 ${jugador.pot || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🕳️ ${jugador.hole || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🍎 ${jugador.uhc || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🍲 ${jugador.soup || 'N/A'}</span>
                    <span style="background: #1c1a27; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #3c2a6b; color: #a78bfa;">🏃 ${jugador.parkour || 'N/A'}</span>
                </div>
            `;
        } else {
            contenidoRango = `<span style="color: #a78bfa; font-weight: bold; background: #1c1a27; padding: 6px 12px; border-radius: 4px; border: 1px solid #3c2a6b;">${jugador[modoActual] || 'N/A'}</span>`;
        }

        const avatar = jugador.avatarUrl
            ? `<img src="${jugador.avatarUrl}" alt="" width="36" height="36" style="border-radius: 50%; object-fit: cover;">`
            : '👤';

        const fila = `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${avatar}</td>
                <td>${jugador.nombre || 'Unknown'}</td>
                <td><span style="color: #6b7280;">${jugador.region || 'N/A'}</span></td>
                <td style="color: #50c878; font-weight: bold;">${jugador.puntos || 0} pts</td>
                <td>${contenidoRango}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

document.getElementById("playerSearch").addEventListener("input", buscarJugador);

document.querySelectorAll('#modo-menu .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarModo(btn.dataset.mode, btn));
});

document.querySelectorAll('#region-menu .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarRegion(btn.dataset.region, btn));
});

onSnapshot(collection(db, "leaderboard"), snapshot => {
    jugadores = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    actualizarLeaderboard();
}, error => {
    console.error("Error leyendo leaderboard de Firebase:", error);
    document.getElementById("leaderboard-body").innerHTML =
        '<tr><td colspan="6">No se pudo cargar el leaderboard.</td></tr>';
});

actualizarLeaderboard();
