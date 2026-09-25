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

const MODES = [
    ["sword", "⚔️", "Sword"],
    ["enchanted", "✨", "Enchanted"],
    ["skywars", "☁️", "SkyWars"],
    ["bedwars", "🛏️", "BedWars"],
    ["pot", "🧪", "Pot"],
    ["hole", "🕳️", "Hole"],
    ["uhc", "🍎", "UHC"],
    ["soup", "🍲", "Soup"],
    ["parkour", "🏃", "Parkour"]
];

let jugadores = [];
let modoActual = "overall";
let regionActual = "ALL";
let busquedaActual = "";

const $ = id => document.getElementById(id);

function cambiarModo(nuevoModo, boton) {
    modoActual = nuevoModo;
    document.querySelectorAll("#modo-menu .mode-tab").forEach(btn => btn.classList.remove("active"));
    boton?.classList.add("active");
    actualizarLeaderboard();
}

function cambiarRegion(nuevaRegion, boton) {
    regionActual = nuevaRegion;
    document.querySelectorAll("#region-menu .region-tab").forEach(btn => btn.classList.remove("active"));
    boton?.classList.add("active");
    actualizarLeaderboard();
}

function getTier(player, mode) {
    return mode === "overall" ? null : (player[mode] || "N/A");
}

function tierRank(tier) {
    const value = String(tier || "").toUpperCase();
    const match = value.match(/([HTL])(\d+)/);
    if (!match) return 999;
    const level = Number(match[2]);
    const type = match[1];
    return (type === "HT" ? 0 : type === "LT" ? 10 : 20) + level;
}

function sortPlayers(list) {
    return [...list].sort((a, b) => {
        if (modoActual !== "overall") {
            const tierDiff = tierRank(a[modoActual]) - tierRank(b[modoActual]);
            if (tierDiff !== 0) return tierDiff;
        }
        return Number(b.puntos || 0) - Number(a.puntos || 0);
    });
}

function avatarHtml(player, className = "player-avatar") {
    if (player.avatarUrl) {
        return `<img class="${className}" src="${player.avatarUrl}" alt="" loading="lazy">`;
    }
    return `<div class="${className}">👤</div>`;
}

function podiumContent(player, place) {
    $(`name-${place}`).textContent = player?.nombre || "-";
    $(`points-${place}`).textContent = player
        ? (modoActual === "overall" ? `${Number(player.puntos || 0)} pts` : `Tier: ${player[modoActual] || "N/A"}`)
        : "0 pts";

    const avatar = $(`avatar-${place}`);
    avatar.innerHTML = player?.avatarUrl
        ? `<img src="${player.avatarUrl}" alt="" loading="lazy">`
        : (place === 1 ? "👑" : "👤");
}

function actualizarLeaderboard() {
    const filtrados = jugadores.filter(j => {
        const nombre = String(j.nombre || "");
        const matchRegion = regionActual === "ALL" || j.region === regionActual;
        const matchSearch = nombre.toLowerCase().includes(busquedaActual);
        return matchRegion && matchSearch;
    });

    const ordenados = sortPlayers(filtrados);

    podiumContent(ordenados[0], 1);
    podiumContent(ordenados[1], 2);
    podiumContent(ordenados[2], 3);

    const tbody = $("leaderboard-body");

    if (!ordenados.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty">No players found for these filters.</td></tr>';
        return;
    }

    tbody.innerHTML = ordenados.map((jugador, index) => {
        const chips = modoActual === "overall"
            ? MODES.map(([key, icon, label]) =>
                `<span class="tier-chip" title="${label}">${icon} <b>${jugador[key] || "N/A"}</b></span>`
            ).join("")
            : `<span class="tier-chip">${MODES.find(m => m[0] === modoActual)?.[1] || "⚔️"} <b>${jugador[modoActual] || "N/A"}</b></span>`;

        return `
            <tr>
                <td class="rank-cell">#${index + 1}</td>
                <td>
                    <div class="player-cell">
                        ${avatarHtml(jugador)}
                        <span class="player-name">${jugador.nombre || "Unknown"}</span>
                    </div>
                </td>
                <td><span class="region-badge">${jugador.region || "N/A"}</span></td>
                <td class="points-cell">${Number(jugador.puntos || 0)} pts</td>
                <td><div class="tiers">${chips}</div></td>
            </tr>
        `;
    }).join("");
}

$("playerSearch").addEventListener("input", event => {
    busquedaActual = event.target.value.toLowerCase().trim();
    actualizarLeaderboard();
});

document.querySelectorAll("#modo-menu .mode-tab").forEach(btn => {
    btn.addEventListener("click", () => cambiarModo(btn.dataset.mode, btn));
});

document.querySelectorAll("#region-menu .region-tab").forEach(btn => {
    btn.addEventListener("click", () => cambiarRegion(btn.dataset.region, btn));
});

document.addEventListener("keydown", event => {
    if (event.key === "/" && document.activeElement !== $("playerSearch")) {
        event.preventDefault();
        $("playerSearch").focus();
    }
});

onSnapshot(
    collection(db, "leaderboard"),
    snapshot => {
        jugadores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        actualizarLeaderboard();
    },
    error => {
        console.error("Error leyendo leaderboard de Firebase:", error);
        $("leaderboard-body").innerHTML =
            '<tr><td colspan="5" class="empty">Firebase no permite leer el leaderboard. Revisa las reglas de Firestore.</td></tr>';
    }
);

actualizarLeaderboard();