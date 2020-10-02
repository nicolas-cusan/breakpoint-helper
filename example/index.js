import './index.scss';
import bph from '../src/index.js';

const instance = bph('meta');

const {
  getMediaQuery,
  isMatching,
  listen,
  listenAll,
  getBreakpoints,
} = instance;

const result = document.getElementById('result');

result.innerHTML = `getBreakpoints() ${JSON.stringify(
  getBreakpoints(),
  null,
  2
)}
getMediaQuery('sm') ${getMediaQuery('sm')}
getMediaQuery('sm', true) ${getMediaQuery('sm', true)}
getMediaQuery(['sm', 'lg']) ${getMediaQuery(['sm', 'lg'])}
isMatching('sm') ${isMatching('sm')}
isMatching('sm', true) ${isMatching('sm', true)}
isMatching(['sm', 'lg']) ${isMatching(['sm', 'lg'])}`;

const state = {
  listening: true,
  changing: true,
};

const listenResult = document.getElementById('listen-result');
const listenToggler = document.getElementById('listen-toggler');

const renderListen = ({ matches }) => {
  listenResult.innerHTML = `is media query 'sm' active? : ${matches}`;
};

const listener = listen({ name: 'sm', immediate: true }, renderListen);

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

const change = listenAll(
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
