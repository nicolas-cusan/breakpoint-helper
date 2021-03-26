const doc = document.documentElement;

// Update color
window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;
  if (typeof event.data !== 'string') return;

  doc.style.setProperty('--link-color', event.data);
});

// Handle Resize
const resizer = document.querySelector('.resizer-inner');
const dragger = document.querySelector('.resizer-dragger');

dragger.addEventListener('pointerdown', initDrag, false);

let startX, startWidth;

function initDrag(e) {
  startX = e.clientX;
  startWidth = parseInt(window.getComputedStyle(resizer).width, 10);
  doc.addEventListener('pointermove', doDrag, false);
  doc.addEventListener('pointerup', stopDrag, false);
}

function doDrag(e) {
  resizer.style.width = startWidth + e.clientX - startX + 'px';
}

function stopDrag(e) {
  doc.removeEventListener('pointermove', doDrag, false);
  doc.removeEventListener('pointerup', stopDrag, false);
}
