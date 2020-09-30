function bph(config = {}) {
  let breakpoints = {};

  if (typeof config === 'string' && config === 'meta') {
    breakpoints = _getBpsFromMeta();
  } else if (typeof config === 'string' && config === 'custom') {
    breakpoints = _getBpsFromCustomProps();
  } else {
    breakpoints = config;
  }

  if (Object.keys(breakpoints).length === 0) {
    throw new Error(`No breakpoints defined`);
  }

  /**
   * Generate a `meta` element with class `ff-bph` and deserialize the css `font-family` value to retrieve breakpoints.
   * @returns {object} Object containing the breakpoints
   */

  function _getBpsFromMeta() {
    const el = document.createElement('meta');
    el.classList.add('ff-bph');
    document.getElementsByTagName('head')[0].appendChild(el);

    let fontFamily = window
      .getComputedStyle(el)
      .getPropertyValue('font-family');

    if (fontFamily.length <= 0) return {};

    fontFamily = fontFamily.replace(/'|"/g, '').split('&');

    return fontFamily.reduce((obj, elem) => {
      const [name, value] = elem.split('=');
      obj[name] = value;
      return obj;
    }, {});
  }

  /**
   * Retrieve breakpoints by reading css custom properties on the `:root` selector, of all loaded stylesheets, starting with `--bph-`.
   * @returns {object} Object containing the breakpoints
   */

  function _getBpsFromCustomProps() {
    const sheets = [...document.styleSheets].filter(
      (sheet) => sheet.href.indexOf(window.location.origin) !== -1
    );

    const rules = [...sheets].reduce((acc, sheet) => {
      [...sheet.cssRules].forEach((rule) => {
        if (rule.selectorText === ':root') {
          const css = rule.cssText.split('{')[1].replace('}', '').split(';');

          css.forEach((dec) => {
            const [prop, val] = dec.split(':');

            if (prop.indexOf('--bph-') !== -1) {
              acc[prop.replace('--bph-', '').trim()] = val.trim();
            }
          });
        }
      });
      return acc;
    }, {});

    return rules;
  }

  /**
   * Check if the breakpoints passed in are matching
   * @param {array} keys Array of breakpoint names
   * @param {boolean} isMax Use `max-width`
   * @returns {array} Array containing all matching breakpoint names in reverse order.
   */

  function _matchAll(keys, isMax = false) {
    const matches = [];
    keys.forEach((bp) => {
      if (isMatching(bp, isMax)) {
        matches.push(bp);
      }
    });
    return isMax ? matches : matches.reverse();
  }

  /**
   * Get all breakpoints.
   * @returns {object} Object containing all breakpoints.
   */

  function getBreakpoints() {
    return breakpoints;
  }

  /**
   * Get a `min-` or `max-width` media query by name.
   * @param {string} breakpoint A breakpoint name
   * @param {boolean} isMax Use `max-width`
   */

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

  /**
   * Check if a breakpoint is currently active/matching
   * @param {string} breakpoint Breakpoint name
   * @param {boolean} isMax Use `max-width`
   * @returns {boolean}
   */

  function isMatching(breakpoint, isMax = false) {
    return window.matchMedia(getMediaQuery(breakpoint, isMax)).matches;
  }

  /**
   *
   * @param {object} options
   * @param {function} callback
   */
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

export default bph;
