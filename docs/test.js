import bph from '../src/index';
import { renderExample } from './renderExample';

// Create the instance
const bps = {
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
};

const instance = bph(bps);

const {
  getBreakpoints,
  getMediaQuery,
  isMatching,
  listen,
  listenAll,
} = instance;

renderExample({
  subtitle: 'instance',
  result: instance.toString(),
  code: `import bph from 'breakpoint-helper';

const instance = bph({
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
});

const {
  getBreakpoints,
  getMediaQuery,
  isMatching,
  listen,
  listenAll,
} = instance;`,
});

renderExample({
  title: 'getBreakpoints()',
  code: `const bps = getBreakpoints();
console.log(bps);`,
  result: JSON.stringify(getBreakpoints(), null, 2),
});

renderExample({
  title: 'getMediaQuery()',
  code: `const mq = getMediaQuery('sm');
console.log(mq);`,
  result: getMediaQuery('sm'),
});

renderExample({
  title: '',
  code: `const mq = getMediaQuery('sm', true);
console.log(mq);`,
  result: getMediaQuery('sm', true),
});

renderExample({
  title: '',
  code: `const mq = getMediaQuery(['sm', 'lg']);
console.log(mq);`,
  result: getMediaQuery(['sm', 'lg']),
});

renderExample({
  title: 'isMatching()',
  code: `const match = isMatching('sm');
console.log(match);`,
  result: isMatching('sm'),
});

renderExample({
  title: '',
  code: `const match = isMatching('sm', true);
console.log(match);`,
  result: isMatching('sm', true),
});

renderExample({
  title: '',
  code: `const match = isMatching(['sm', 'lg']);
console.log(match);`,
  result: isMatching(['sm', 'lg']),
});

(function () {
  const snippet = `const listener = listen('sm', ({ matches }) => {
  console.log(matches);
});`;
  const { result, button } = renderExample({
    title: 'listen()',
    useBtn: true,
    code: snippet,
  });

  const listener = listen('sm', ({ matches }) => {
    result(matches);
  });

  button(listener);
})();

(function () {
  const snippet = `const listener = listen(['sm', 'lg'], ({ matches }) => {
  console.log(matches);
});`;
  const { result, button } = renderExample({
    title: '',
    useBtn: true,
    code: snippet,
  });

  const listener = listen(['sm', 'lg'], ({ matches }) => {
    result(matches);
  });

  button(listener);
})();

(function () {
  const snippet = `const listener = listen(
  {
    name: 'sm',
    useMax: true,
  },
  ({ matches }) => {
    console.log(matches);
  }
);`;
  const { result, button } = renderExample({
    title: '',
    useBtn: true,
    code: snippet,
  });

  const listener = listen(
    {
      name: 'sm',
      useMax: true,
    },
    ({ matches }) => {
      result(matches);
    }
  );

  button(listener);
})();

(function () {
  const snippet = `const listener = listen(
  {
    name: 'sm',
    immediate: false
  },
  ({ matches }) => {
    console.log(matches);
  }
);`;
  const { result, button } = renderExample({
    title: '',
    useBtn: true,
    code: snippet,
    result: `// Resize the window to see a result.\n// You need to move passed ${bps['sm']}.`,
  });

  const listener = listen(
    {
      name: 'sm',
      immediate: false,
    },
    ({ matches }) => {
      result(matches);
    }
  );

  button(listener);
})();

(function () {
  const snippet = `const listener = listen(
  {
    name: ['sm', 'lg'],
    immediate: false
  },
  ({ matches }) => {
    console.log(matches);
  }
);`;
  const { result, button } = renderExample({
    title: '',
    useBtn: true,
    code: snippet,
    result: `// Resize the window to see a result.\n// You need to move passed ${
      bps['sm']
    } or ${parseInt(bps['lg']) - 1}px.`,
  });

  const listener = listen(
    {
      name: ['sm', 'lg'],
      immediate: false,
    },
    ({ matches }) => {
      result(matches);
    }
  );

  button(listener);
})();

(function () {
  const snippet = `const listener = listenAll((matches) => {
  console.log(matches);
});`;
  const { result, button } = renderExample({
    title: 'listenAll()',
    useBtn: true,
    code: snippet,
  });

  const listener = listenAll((matches) => {
    result(JSON.stringify(matches));
  });

  button(listener);
})();

(function () {
  const snippet = `const listener = listenAll(
  (matches) => {
    console.log(matches);
  },
  {
    listenTo: ['sm', 'lg', 'xxl'],
  }
);`;
  const { result, button } = renderExample({
    title: '',
    useBtn: true,
    code: snippet,
  });

  const listener = listenAll(
    (matches) => {
      result(JSON.stringify(matches));
    },
    {
      listenTo: ['sm', 'lg', 'xxl'],
    }
  );

  button(listener);
})();

(function () {
  const snippet = `const listener = listenAll(
  (matches) => {
    console.log(matches);
  },
  {
    listenTo: ['sm', 'lg', 'xxl'],
    useMax: true,
  }
);`;
  const { result, button } = renderExample({
    title: '',
    useBtn: true,
    code: snippet,
  });

  const listener = listenAll(
    (matches) => {
      result(JSON.stringify(matches));
    },
    {
      listenTo: ['sm', 'lg', 'xxl'],
      useMax: true,
    }
  );

  button(listener);
})();

(function () {
  const snippet = `const listener = listenAll(
  (matches) => {
    console.log(matches);
  },
  {
    immediate: false,
  }
);`;
  const { result, button } = renderExample({
    title: '',
    useBtn: true,
    code: snippet,
    result: `// Resize the window to see a result.`,
  });

  const listener = listenAll(
    (matches) => {
      result(JSON.stringify(matches));
    },
    {
      immediate: false,
    }
  );

  button(listener);
})();
