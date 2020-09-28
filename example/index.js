import './index.scss';
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

const state = {
  listening: true,
  changing: true,
};

const listenResult = document.getElementById('listen-result');
const listenToggler = document.getElementById('listen-toggler');

const renderListen = ({ matches }) => {
  listenResult.innerHTML = `is media query 'sm' active? : ${matches}`;
};

const listener = bph.listen({ name: 'sm', immediate: true }, renderListen);
listener.on();

listenToggler.addEventListener('click', () => {
  if (state.listening) {
    listener.off();
  } else {
    listener.on();
  }

  state.listening = !state.listening;
});

const changeResult = document.getElementById('change-result');
const changeToggler = document.getElementById('change-toggler');

const change = bph.listenAll(
  (bp) => {
    changeResult.innerHTML = bp;
  },
  { isMax: false }
);

changeToggler.addEventListener('click', () => {
  if (state.changing) {
    change.off();
    changeResult.innerHTML = `${changeResult.innerHTML} OFF`;
  } else {
    change.on();
    changeResult.innerHTML = `${changeResult.innerHTML} ON`;
  }

  state.changing = !state.changing;
});

change.on();
