function bph() {
  const el = document.createElement('meta');
  el.classList.add('ff-bph');
  document.getElementsByTagName('head')[0].appendChild(el);

  let fontFamily = window.getComputedStyle(el).getPropertyValue('font-family');

  console.dir(document.documentElement);

  // Break out if the element does not exist.
  if (fontFamily.length <= 0) return;

  fontFamily = fontFamily.replace(/'|"/g, '').split('&');

  const breakpoints = fontFamily.reduce((prevVal, elem) => {
    const [name, value] = elem.split('=');
    prevVal[name] = value;
    return prevVal;
  }, {});

  function getBreakpoints() {
    return breakpoints;
  }

  function getMediaQuery(breakpoint, isMax = false) {
    if (Array.isArray(breakpoint)) {
      const [min, max] = breakpoint;
      return `${getMediaQuery(min)} and ${getMediaQuery(max, true)}`;
    }

    const min = breakpoints[breakpoint];

    if (typeof min === 'undefined') {
      throw new Error(`"${breakpoint}" does not seem to be a breakpoint name`);
    }

    if (isMax) {
      return `(max-width: ${parseFloat(min, 10) - 1}px)`;
    }

    return `(min-width: ${min})`;
  }

  function isMatching(breakpoint, isMax = false) {
    return window.matchMedia(getMediaQuery(breakpoint, isMax)).matches;
  }

  function listen(options, callback = () => {}) {
    let mq = null;

    function on() {
      if (typeof options === 'string') {
        mq = window.matchMedia(getMediaQuery(options));
        mq.addListener(callback);
      } else {
        const { name, isMax, immediate } = options;
        const opts = {
          name,
          isMax: isMax || false,
          immediate: immediate || true,
        };

        mq = window.matchMedia(getMediaQuery(opts.name, opts.isMax));

        if (opts.immediate) callback(mq);

        mq.addListener(callback);
      }
    }

    function off() {
      if (mq) {
        mq.removeListener(callback);
        mq = null;
      }
    }

    return { on, off };
  }

  function _matchAll(keys, isMax = false) {
    const matches = [];
    keys.forEach((bp) => {
      if (isMatching(bp, isMax)) {
        matches.push(bp);
      }
    });
    return isMax ? matches : matches.reverse();
  }

  function listenAll(callback = () => {}, options = {}) {
    const keys = Object.keys(breakpoints);
    let listeners = [];
    let bps = keys;

    if (keys.length === 0) return;

    const { isMax, immediate, listenTo } = options;
    const opts = {
      isMax: isMax || false,
      immediate: immediate || true,
    };

    if (listenTo) {
      bps = listenTo.sort((a, b) => {
        return parseInt(breakpoints[a], 10) - parseInt(breakpoints[b], 10);
      });
    }

    function on() {
      bps.forEach((bp, idx) => {
        const cb = () => {
          callback(_matchAll(bps, opts.isMax));
        };

        const listener = listen({ name: bp, ...opts }, cb);
        listeners.push(listener);
        listener.on();
      });
    }

    function off() {
      if (listeners.length) {
        listeners.forEach((listener) => listener.off());
        listeners = [];
      }
    }

    return { on, off };
  }

  return {
    getBreakpoints,
    getMediaQuery,
    isMatching,
    listen,
    listenAll,
  };
}

export default bph();
