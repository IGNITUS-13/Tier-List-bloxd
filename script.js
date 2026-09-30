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

const REGION_NAMES = {
  ALL: "ALL",
  NA: "NORTH AMERICA",
  EU: "EUROPE",
  AS: "ASIA",
  SA: "SOUTH AMERICA",
  AF: "AFRICA",
  AU: "AUSTRALIA"
};

let jugadores = [];
let modoActual = "overall";
let regionActual = "ALL";
let busquedaActual = "";
let lastSync = null;

const $ = id => document.getElementById(id);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function tierScore(tier) {
  const value = String(tier || "").toUpperCase().trim();
  if (value === "N/A" || !value) return 999;
  const match = value.match(/^(HT|LT|T)([1-5])$/);
  if (!match) return 998;

  const type = match[1];
  const level = Number(match[2]);

  if (type === "HT") return level;
  if (type === "LT") return 10 + level;
  return 20 + level;
}

function tierClass(tier) {
  const value = String(tier || "").toUpperCase();
  if (value.startsWith("HT")) return "tier-ht";
  if (value.startsWith("LT")) return "tier-lt";
  if (value.startsWith("T")) return "tier-t";
  return "tier-na";
}

function getTier(player, mode) {
  return mode === "overall" ? null : (player[mode] || "N/A");
}

function sortPlayers(list) {
  return [...list].sort((a, b) => {
    if (modoActual !== "overall") {
      const aTier = tierScore(a[modoActual]);
      const bTier = tierScore(b[modoActual]);

      if (aTier !== bTier) return aTier - bTier;
    }

    const pointsDiff = Number(b.puntos || 0) - Number(a.puntos || 0);
    if (pointsDiff !== 0) return pointsDiff;

    return String(a.nombre || "").localeCompare(String(b.nombre || ""));
  });
}

function avatarHtml(player, className = "player-avatar") {
  if (player.avatarUrl) {
    return `<img class="${className}" src="${esc(player.avatarUrl)}" alt="" loading="lazy">`;
  }
  return `<div class="${className} fallback-avatar">👤</div>`;
}

function podiumContent(player, place) {
  $(`name-${place}`).textContent = player?.nombre || "—";

  $(`points-${place}`).textContent = player
    ? (modoActual === "overall"
      ? `${Number(player.puntos || 0).toLocaleString()} pts`
      : `Tier ${player[modoActual] || "N/A"}`)
    : "—";

  const avatar = $(`avatar-${place}`);
  avatar.innerHTML = player?.avatarUrl
    ? `<img src="${esc(player.avatarUrl)}" alt="" loading="lazy">`
    : (place === 1 ? "👑" : "👤");
}

function modeChip(key, icon, label, player) {
  const tier = player[key] || "N/A";
  return `
    <span class="tier-chip ${tierClass(tier)}" title="${esc(label)}">
      <span>${icon}</span><b>${esc(tier)}</b>
    </span>
  `;
}

function updateStats(filteredCount) {
  $("stat-players").textContent = filteredCount.toLocaleString();
  $("stat-mode").textContent = modoActual === "overall"
    ? "OVERALL"
    : (MODES.find(mode => mode[0] === modoActual)?.[2] || modoActual).toUpperCase();
  $("stat-sync").textContent = lastSync ? "LIVE" : "CONNECTING";
}

function updateLeaderboard() {
  const filtered = jugadores.filter(player => {
    const name = String(player.nombre || player.displayName || "");
    const regionMatch = regionActual === "ALL" || String(player.region || "").toUpperCase() === regionActual;
    const searchMatch = name.toLowerCase().includes(busquedaActual);
    return regionMatch && searchMatch;
  });

  const ordered = sortPlayers(filtered);

  updateStats(ordered.length);
  podiumContent(ordered[0], 1);
  podiumContent(ordered[1], 2);
  podiumContent(ordered[2], 3);

  const tbody = $("leaderboard-body");

  if (!ordered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty">
          <div class="empty-icon">🔥</div>
          <b>No players found</b>
          <span>Try another player, region or mode.</span>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = ordered.map((player, index) => {
    const rank = index + 1;
    const rankClass = rank <= 3 ? ` top-rank rank-${rank}` : "";

    const chips = modoActual === "overall"
      ? MODES.map(([key, icon, label]) => modeChip(key, icon, label, player)).join("")
      : modeChip(
          modoActual,
          MODES.find(mode => mode[0] === modoActual)?.[1] || "•",
          MODES.find(mode => mode[0] === modoActual)?.[2] || modoActual,
          player
        );

    return `
      <tr class="${rankClass}">
        <td class="rank-cell">
          <span class="rank-number">${rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : "#" + rank}</span>
        </td>
        <td>
          <div class="player-cell">
            ${avatarHtml(player)}
            <div>
              <span class="player-name">${esc(player.nombre || "Unknown")}</span>
              <small>${esc(player.displayName || "")}</small>
            </div>
          </div>
        </td>
        <td><span class="region-badge">${esc(player.region || "N/A")}</span></td>
        <td class="points-cell">${Number(player.puntos || 0).toLocaleString()} <small>PTS</small></td>
        <td><div class="tiers">${chips}</div></td>
      </tr>
    `;
  }).join("");
}

function setMode(mode, button) {
  modoActual = mode;
  document.querySelectorAll("#modo-menu .mode-tab").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  updateLeaderboard();
}

function setRegion(region, button) {
  regionActual = region;
  document.querySelectorAll("#region-menu .region-tab").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  updateLeaderboard();
}

$("playerSearch").addEventListener("input", event => {
  busquedaActual = event.target.value.toLowerCase().trim();
  updateLeaderboard();
});

document.querySelectorAll("#modo-menu .mode-tab").forEach(button => {
  button.addEventListener("click", () => setMode(button.dataset.mode, button));
});

document.querySelectorAll("#region-menu .region-tab").forEach(button => {
  button.addEventListener("click", () => setRegion(button.dataset.region, button));
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
    lastSync = new Date();

    $("stat-sync").textContent = "LIVE";
    updateLeaderboard();
  },
  error => {
    console.error("Firebase leaderboard error:", error);
    $("stat-sync").textContent = "ERROR";
    $("leaderboard-body").innerHTML = `
      <tr>
        <td colspan="5" class="empty">
          <div class="empty-icon">⚠️</div>
          <b>Could not load the leaderboard</b>
          <span>Check the Firestore rules and Firebase project.</span>
        </td>
      </tr>`;
  }
);

updateLeaderboard();