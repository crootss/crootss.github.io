import { croot } from 'https://cdn.jsdelivr.net/gh/crootss/crootss@v0.2.0/croot.min.js';

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
