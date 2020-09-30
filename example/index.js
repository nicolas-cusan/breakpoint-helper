import './index.scss';
import bph from '../src/index.js';

const instance = bph({
  xs: '274px',
  sm: '486px',
  lg: '884px',
  xl: '1090px',
});

const result = document.getElementById('result');

result.innerHTML = `instance.getBreakpoints() ${JSON.stringify(
  instance.getBreakpoints(),
  null,
  2
)}
instance.getMediaQuery('sm') ${instance.getMediaQuery('sm')}
instance.getMediaQuery('sm', true) ${instance.getMediaQuery('sm', true)}
instance.getMediaQuery(['sm', 'lg']) ${instance.getMediaQuery(['sm', 'lg'])}
instance.isMatching('sm') ${instance.isMatching('sm')}
instance.isMatching('sm', true) ${instance.isMatching('sm', true)}
instance.isMatching(['sm', 'lg']) ${instance.isMatching(['sm', 'lg'])}`;

const state = {
  listening: true,
  changing: true,
};

const listenResult = document.getElementById('listen-result');
const listenToggler = document.getElementById('listen-toggler');

const renderListen = ({ matches }) => {
  listenResult.innerHTML = `is media query 'sm' active? : ${matches}`;
};

const listener = instance.listen({ name: 'sm', immediate: true }, renderListen);
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

const change = instance.listenAll(
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
