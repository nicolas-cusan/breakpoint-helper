import bph from '../src/index';

const colors = {
  xs: 'salmon',
  sm: 'mediumseagreen',
  md: 'gold',
  lg: 'royalblue',
  xl: 'darkviolet',
  xxl: 'deeppink',
};

const instance = bph({
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
});

const { listenAll, getMediaQuery } = instance;

const root = document.getElementById('root');
const [body] = document.getElementsByTagName('body');

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

listenAll((bps) => {
  if (bps.length) {
    const bp = bps[0];
    body.style.backgroundColor = colors[bp];
    root.innerHTML = `
      <div class="bp-name">${bp}</div>
      <div class="bp-mq">${getMediaQuery(bp)}</div>
    `;
  } else {
    body.style.backgroundColor = null;
    root.innerHTML = '';
  }
});
