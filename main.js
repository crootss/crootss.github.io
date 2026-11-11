import { croot } from 'https://cdn.jsdelivr.net/gh/crootss/crootss@v0.4.0/croot.min.js';

const deck = croot('[data-croot]');
const pos = document.querySelector('.hud-pos');

function showPos() {
  pos.textContent = deck.isOverview ? 'overview' : `${deck.index + 1} / ${deck.steps.length}`;
}

// Tema dari crootss/themes. URL-nya diturunkan dari <link id="tema"> supaya
// versi yang dipin cukup diatur di index.html (diperbarui otomatis oleh workflow).
const THEMES = { poster: 'Poster', gelap: 'Gelap', minimal: 'Minimal' };
const themeLink = document.getElementById('tema');
const themeLabel = document.querySelector('.hud-tema');
let theme = 'poster';

function setTheme(name) {
  if (!THEMES[name]) return;
  theme = name;
  themeLink.href = themeLink.href.replace(/[a-z]+\.min\.css$/, `${name}.min.css`);
  themeLabel.textContent = THEMES[name];
  document.querySelectorAll('[data-tema]').forEach((b) => b.classList.toggle('ghost', b.dataset.tema !== name));
  // Pilihan tema hanya kenyamanan per pengunjung; halaman tetap jalan tanpa storage.
  try { localStorage.setItem('crootss-tema', name); } catch {}
}

function nextTheme() {
  const names = Object.keys(THEMES);
  setTheme(names[(names.indexOf(theme) + 1) % names.length]);
}

document.querySelector('.hud').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  const act = button.dataset.act;
  if (act === 'tema') nextTheme();
  else if (act) deck[act]();
  button.blur();
});

// Tombol tema di slide "Tiga tema siap pakai"
document.addEventListener('click', (e) => {
  const button = e.target.closest('[data-tema]');
  if (button) setTheme(button.dataset.tema);
});

let saved = null;
try { saved = localStorage.getItem('crootss-tema'); } catch {}
setTheme(new URLSearchParams(location.search).get('tema') || saved || 'poster');
deck.root.addEventListener('croot:enter', showPos);
deck.root.addEventListener('croot:overview', showPos);
document.body.classList.add('js');
showPos();

// Tombol "Salin" untuk perintah di slide "Buka di komputermu".
document.addEventListener('click', async (e) => {
  const button = e.target.closest('[data-copy]');
  if (!button) return;
  const label = button.textContent;
  try {
    await navigator.clipboard.writeText(document.querySelector(button.dataset.copy).textContent);
    button.textContent = 'Tersalin ✓';
  } catch {
    // Clipboard API butuh HTTPS/localhost dan izin browser; teks tetap bisa diseleksi manual.
    button.textContent = 'Gagal, salin manual';
  }
  setTimeout(() => { button.textContent = label; }, 1500);
});

// Bilah navigasi menghilang setelah penonton diam (seperti mode slideshow
// PowerPoint) supaya tidak menutupi slide; muncul lagi saat mouse bergerak
// atau layar disentuh. Gaya .hud-idle ada di crootss/themes.
const hud = document.querySelector('.hud');
let idleTimer = 0;
function wakeHud() {
  hud.classList.remove('hud-idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => hud.classList.add('hud-idle'), 2500);
}
document.addEventListener('pointermove', wakeHud, { passive: true });
document.addEventListener('pointerdown', wakeHud, { passive: true });
wakeHud();
