import { croot } from 'https://cdn.jsdelivr.net/gh/crootss/crootss@v0.3.0/croot.min.js';

const deck = croot('[data-croot]');
const pos = document.querySelector('.hud-pos');

function showPos() {
  pos.textContent = deck.isOverview ? 'overview' : `${deck.index + 1} / ${deck.steps.length}`;
}

document.querySelector('.hud').addEventListener('click', (e) => {
  const act = e.target.dataset.act;
  if (!act) return;
  deck[act]();
  e.target.blur();
});
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
