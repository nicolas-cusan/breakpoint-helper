import bph from '../dist/breakpoint-helper';

const colors = {
  xs: 'salmon',
  sm: 'darkviolet',
  md: 'gold',
  lg: 'deeppink',
  xl: 'mediumseagreen',
  xxl: 'royalblue',
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

const mobileMessage = `
  <div class="bp-note">
    It looks like you are uing a mobile device, turn your phone to see a different breakpoint.
  </div>
`;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

function updateColor(color) {
  document.body.style.backgroundColor = color;
  parent.postMessage(color, window.location.origin);
}

listenAll((bps) => {
  const color = bps.length ? colors[bps[0]] : 'turquoise';
  updateColor(color);

  if (bps.length) {
    const bp = bps[0];
    root.innerHTML = `
      <div class="bp-name">${bp}</div>
      <div class="bp-mq">${getMediaQuery(bp)}</div>
    `;
  } else {
    if (!isMobile) {
      ``;
    }
    root.innerHTML = `
    ${isMobile ? mobileMessage : ''}
    <div class="bp-mq">No breakpoint active</div>
    `;
  }
});
