function bph() {
  const el = document.createElement('meta');
  el.classList.add('ff-bph');
  document.getElementsByTagName('head')[0].appendChild(el);

  let fontFamily = window.getComputedStyle(el).getPropertyValue('font-family');

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
          immediate: immediate || false,
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

  function getCurrentMediaqueryName() {
    const bps = Object.keys(breakpoints);
    return bps.reverse().find((bp) => {
      return isMatching(bp);
    });
  }

  function listenToBreakpointChange(callback = () => {}) {
    const bps = Object.keys(breakpoints);
    if (bps.length === 0) return;

    const cb = () => {
      callback(getCurrentMediaqueryName());
    };

    if (bps.length === 1) {
      listenMatchMin(bps[0], cb);
      return;
    }

    bps.forEach((key, idx) => {
      if (idx === 0) {
        listenMatchMax(key, cb);
        listenMatchBetween(key, bps[idx + 1], cb);
      } else if (idx === bps.length - 1) {
        listenMatchMin(key, cb);
      } else {
        listenMatchBetween(key, bps[idx + 1], cb);
      }
    });

    // return callback to make it possible do remove the listeners.
    return cb;
  }

  function stopListeningToChange(cb = () => {}) {
    const bps = Object.keys(breakpoints);
    if (bps.length === 0) return;

    if (bps.length === 1) {
      removeListenerMin(bps[0], cb);
      return;
    }

    bps.forEach((key, idx) => {
      if (idx === 0) {
        removeListenerMax(key, cb);
        removeListenerMaxBetween(key, bps[idx + 1], cb);
      } else if (idx === bps.length - 1) {
        removeListenerMin(key, cb);
      } else {
        removeListenerMaxBetween(key, bps[idx + 1], cb);
      }
    });
  }

  return {
    getBreakpoints,
    getMediaQuery,
    isMatching,
    listen,
    // getBreakpoint,
    getCurrentMediaqueryName,
    // getBetweenBreakpoints,
    listenToBreakpointChange,
    stopListeningToChange,
  };
}

export default bph();
