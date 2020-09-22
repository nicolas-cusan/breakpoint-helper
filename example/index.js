import '../src/index.scss';
import bph from '../src/index.js';

const result = document.getElementById('result');

result.innerHTML = `bph.getBreakpoints() ${JSON.stringify(
  bph.getBreakpoints(),
  null,
  2
)}
bph.getMediaQuery('sm') ${bph.getMediaQuery('sm')}
bph.getMediaQuery('sm', true) ${bph.getMediaQuery('sm', true)}
bph.getMediaQuery(['sm', 'lg']) ${bph.getMediaQuery(['sm', 'lg'])}
bph.isMatching('sm') ${bph.isMatching('sm')}
bph.isMatching('sm', true) ${bph.isMatching('sm', true)}
bph.isMatching(['sm', 'lg']) ${bph.isMatching(['sm', 'lg'])}`;

const listenResult = document.getElementById('listen-result');

// bph.listen('sm', ({ matches }) => {
//   listenResult.innerHTML = `
//     is media query 'sm' active? : ${matches}
//   `;
// });

const renderListen = ({ matches }) => {
  listenResult.innerHTML = `
    is media query 'sm' active? : ${matches}
  `;
};

const listener = bph.listen({ name: 'sm', immediate: true }, renderListen);
listener.on();

const state = {
  listening: true,
};

const toggler = document.getElementById('toggler');
toggler.addEventListener('click', () => {
  if (state.listening) {
    listener.off();
  } else {
    listener.on();
  }

  state.listening = !state.listening;
});
