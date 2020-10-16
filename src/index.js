let breakpoints = {};

/**
 * @param {Object|String} config - Object containing the breakpoints, `'meta'` or `'custom'`.
 *
 * @returns {Object<function>} Object containing the instance's methods.
 */

function bph(config = {}) {
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

  return {
    getBreakpoints,
    getMediaQuery,
    isMatching,
    listen,
    listenAll,
  };
}

/**
 * Generate a `meta` element with class `breakpoint-helper` and deserialize the css `font-family` value to retrieve the breakpoints.
 *
 * @private
 * @returns {Object} Breakpoint object.
 */

function _getBpsFromMeta() {
  const el = document.createElement('meta');
  el.classList.add('breakpoint-helper');
  document.getElementsByTagName('head')[0].appendChild(el);

  let fontFamily = window.getComputedStyle(el).getPropertyValue('font-family');

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
 *
 * @private
 * @returns {Object} Breakpoint object.
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
 * Check if the breakpoints in `keys` are matching
 *
 * @private
 * @param {Array} keys - Array of breakpoint names.
 * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
 *
 * @returns {Array<string>} Array containing matching breakpoint names in reverse order.
 */

function _matchAll(keys, useMax = false) {
  const matches = [];
  keys.forEach((bp) => {
    if (isMatching(bp, useMax)) {
      matches.push(bp);
    }
  });
  return useMax ? matches : matches.reverse();
}

/**
 * Get all breakpoints as an object. Useful for debugging or passing breakpoint values to other libraries.
 *
 * @returns {Object} Object containing all instance breakpoints.
 */

function getBreakpoints() {
  return breakpoints;
}

/**
 * Get a `min-width`, `max-width` or `min-width and max-width` media query by breakpoint name.
 *
 * @param {string|Array} name - Breakpoint name or array of two breakpoint names.
 * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
 *
 * @returns {string} Media query string.
 */

function getMediaQuery(name, useMax = false) {
  if (Array.isArray(name)) {
    const [min, max] = name;
    return `${getMediaQuery(min)} and ${getMediaQuery(max, true)}`;
  }

  const min = breakpoints[name];

  if (typeof min === 'undefined') {
    throw new Error(`"${name}" does not seem to be a breakpoint name`);
  }

  if (useMax) {
    const number = parseFloat(min, 10);
    const unit = min.replace(number, '');
    const substract = unit === 'em' ? 0.0635 : 1;
    return `(max-width: ${number - substract}${unit})`;
  }

  return `(min-width: ${min})`;
}

/**
 * Check if a breakpoint or breakpoint range is currently matching.
 *
 * @param {string} name - Breakpoint name or array of two breakpoint names.
 * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
 *
 * @returns {boolean} Whether the breakpoint or breakpoint range is matching or not.
 */

function isMatching(name, useMax = false) {
  return window.matchMedia(getMediaQuery(name, useMax)).matches;
}

/**
 * Listen to a breakpoint or breakpoint range change and execute a callback function. The callback function will receive a `MediaQueryList` object as parameter that can be used to check wether the breakpoint media query is matching or not. The callback function is called once on listener creation, it is possible to opt out of this behavior via options.
 *
 * @param {Object|String} options - Configuration Object, breakpoint name or array of two breakpoint names.
 * @param {string} options.name - Breakpoint name or array of two breakpoint names.
 * @param {boolean} [options.useMax=false] - Use `max-width` instead of `min-width`.
 * @param {boolean} [options.immediate=true] - Execute callback function on listener creation.
 * @param {function} callback - Callback function, receives a `MediaQueryList` as parameter.
 *
 * @returns {Object} Object containing the `on` and `off` listener methods.
 */

function listen(options, callback) {
  let mq = null;

  const { name, useMax, immediate } = options;
  const opts = {
    name,
    useMax: useMax || false,
    immediate: typeof immediate === 'undefined' ? true : immediate,
  };

  function on() {
    if (typeof options === 'string' || Array.isArray(options)) {
      mq = window.matchMedia(getMediaQuery(options));
    } else {
      mq = window.matchMedia(getMediaQuery(opts.name, opts.useMax));
    }

    if (opts.immediate) callback(mq);
    mq.addListener(callback);
  }

  on();

  function off() {
    if (mq) {
      mq.removeListener(callback);
      mq = null;
    }
  }

  return { on, off };
}

/**
 * Listen to all breakpoints matching or un-matching and execute a callback function. The callback function will receive an array of the matching breakpoint names in reverse order as a parameter. That means the largest breakpoint name (or smallest when using `options.useMax`) comes first in the array. The array will be empty if no breakpoints are matching.
 *
 * @param {function} callback - Callback function, receives an array of breakpoint names as parameter.
 * @param {Object} [options] - Configuration Object.
 * @param {Array} [options.listenTo] - Array of breakpoint names. All are used by default.
 * @param {boolean} [options.useMax=false] - Use `max-width` instead of `min-width`.
 * @param {boolean} [options.immediate=true] - Execute callback function on listener creation.
 *
 * @returns {Object} Object containing the `on` and `off` listener methods.
 */

function listenAll(callback, options = {}) {
  const keys = Object.keys(breakpoints);
  let listeners = [];
  let bps = keys;

  if (keys.length === 0) return;

  const { useMax, immediate, listenTo } = options;
  const opts = {
    useMax: useMax || false,
    immediate: typeof immediate === 'undefined' ? true : immediate,
  };

  if (listenTo) {
    bps = listenTo.sort((a, b) => {
      return parseInt(breakpoints[a], 10) - parseInt(breakpoints[b], 10);
    });
  }

  function on() {
    bps.forEach((bp) => {
      const cb = () => {
        callback(_matchAll(bps, opts.useMax));
      };

      const listener = listen({ name: bp, ...opts }, cb);
      listeners.push(listener);
    });
  }

  on();

  function off() {
    if (listeners.length) {
      listeners.forEach((listener) => listener.off());
      listeners = [];
    }
  }

  return { on, off };
}

export default bph;
