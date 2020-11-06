window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;

  document.documentElement.style.setProperty('--link-color', event.data);
});
