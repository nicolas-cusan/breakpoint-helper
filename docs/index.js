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

// Handle Menu

const anchors = [...document.querySelectorAll('#toc a[href^="#"]')];
let headings = getHeadings();

function getHeadings() {
  headings = [...document.querySelectorAll('h2[id],h3[id]')].map((heading) => {
    return {
      id: heading.id,
      top:
        document.getElementById(heading.id).getBoundingClientRect().top +
        window.scrollY,
    };
  });
}

function onScroll() {
  let sortedHeadings = headings.concat([]).sort((a, b) => a.top - b.top);
  let top = window.pageYOffset + window.innerHeight / 3;
  let current = sortedHeadings[0].id;
  for (let i = 0; i < sortedHeadings.length; i++) {
    if (top >= sortedHeadings[i].top) {
      current = sortedHeadings[i].id;
    }
  }

  anchors.forEach((anchor) => {
    anchor.parentElement.classList.remove('active');
  });

  const newAnchor = anchors.find(
    (anchor) => anchor.href.split('#')[1] === current
  );

  if (!newAnchor) return;
  newAnchor.parentElement.classList.add('active');
  if (newAnchor.classList.contains('sub-item')) {
    newAnchor.parentElement.parentElement.parentElement.classList.add('active');
  }
}

window.addEventListener('scroll', onScroll, {
  capture: true,
  passive: true,
});

const resizeObserver = new window.ResizeObserver(() => {
  getHeadings();
});
resizeObserver.observe(document.body);

getHeadings();
onScroll();
