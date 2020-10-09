export const root = document.getElementById('root');
export function renderExample(options = {}) {
  const defaults = {
    title: '',
    subtitle: '',
    useBtn: false,
    code: '',
    result: '',
  };

  const settings = Object.assign({}, defaults, options);
  const { title, subtitle, useBtn, code, result } = settings;

  const h2 = document.createElement('h2');
  const example = document.createElement('div');
  const exampleCode = document.createElement('div');
  const exampleResult = document.createElement('div');
  const codePre = document.createElement('pre');
  const resultPre = document.createElement('pre');
  const button = document.createElement('button');

  example.classList.add('example');

  example.appendChild(exampleCode);
  example.appendChild(exampleResult);

  exampleCode.classList.add('example_item', 'example_item-code');
  exampleCode.appendChild(codePre);

  exampleResult.classList.add('example_item', 'example_item-result');
  exampleResult.appendChild(resultPre);

  codePre.classList.add('example_pre', 'example_pre-code');
  resultPre.classList.add('example_pre', 'example_pre-result');

  h2.innerHTML = `<code>${title}</code> ${subtitle}`;
  codePre.innerHTML = `${code}`;
  resultPre.innerHTML = `${result}`;

  if (title) {
    root.appendChild(h2);
  }

  if (subtitle) {
    h2.innerHTML = subtitle;
    root.appendChild(h2);
  }

  if (code || result) {
    root.appendChild(example);
  }

  if (useBtn) {
    button.innerHTML = 'Disable';
    exampleCode.appendChild(button);
    codePre.classList.add('example_pre-button');
  }

  let isActive = true;

  return {
    code: (txt) => {
      codePre.innerHTML = `${txt}`;
    },
    result: (txt) => {
      resultPre.innerHTML = `${txt}`;
    },
    button: (listener = null) => {
      if (!listener) return;

      button.addEventListener('click', () => {
        if (isActive) {
          listener.off();
          resultPre.innerHTML = `// listener.off() was called!\n// The listener is currently disabled`;
          button.innerHTML = 'Enable';
          resultPre.classList.toggle('example_pre-disabled');
        } else {
          resultPre.innerHTML = `${result}`;
          button.innerHTML = 'Disable';
          resultPre.classList.toggle('example_pre-disabled');
          listener.on();
        }

        isActive = !isActive;
      });
    },
  };
}
