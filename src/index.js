let breakpoints = {};

/**
 * Main instance function
 *
 * @param {Object|String} config - Object containing the breakpoints, `'meta'` or `'custom'`
 * @returns {Object<function>} Returns an object containing methods
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
 * Generate a `meta` element with class `breakpoint-helper` and deserialize the css `font-family` value to retrieve breakpoints.
 *
 * @private
 * @inner
 * @returns {Object} Object containing the breakpoints
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
 * @inner
 * @returns {Object} Object containing the breakpoints
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
 *
 * @private
 * @inner
 * @param {Array} keys Array of breakpoint names
 * @param {boolean} [isMax=false] Use `max-width`
 * @returns {Array<string>} Array containing all matching breakpoint names in reverse order.
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
 *
 * @inner
 * @returns {Object} Object containing all breakpoints.
 */

function getBreakpoints() {
  return breakpoints;
}

/**
 * Get a `min-` or `max-width` media query by name.
 *
 * @inner
 * @param {string} name A breakpoint name
 * @param {boolean} [isMax=false] Use `max-width`
 * @returns {String} A media query
 */

function getMediaQuery(name, isMax = false) {
  if (Array.isArray(name)) {
    const [min, max] = name;
    return `${getMediaQuery(min)} and ${getMediaQuery(max, true)}`;
  }

  const min = breakpoints[name];

  if (typeof min === 'undefined') {
    throw new Error(`"${name}" does not seem to be a breakpoint name`);
  }

  if (isMax) {
    const number = parseFloat(min, 10);
    const unit = min.replace(number, '');
    const substract = unit === 'em' ? 0.0635 : 1;
    return `(max-width: ${number - substract}${unit})`;
  }

  return `(min-width: ${min})`;
}

/**
 * Check if a breakpoint is currently active/matching
 *
 * @inner
 * @param {string} name Breakpoint name
 * @param {boolean} [isMax=false] Use `max-width`
 * @returns {boolean} Whether the breakpoint is matching or not
 */

function isMatching(name, isMax = false) {
  return window.matchMedia(getMediaQuery(name, isMax)).matches;
}

/**
 * Listen to a breakpoint change
 *
 * @inner
 * @param {Object} options
 * @param {string} options.name Breakpoint name to listen to
 * @param {boolean} [options.isMax=false] Use `max-width`
 * @param {string} [options.immediate=true] Call the callback function on invocation
 * @param {function} callback Function called when the breakpoint is triggered
 * @returns {Object} Returns an object containing a `on` and `off` method to enable and disable the listener
 */

function listen(options, callback) {
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
 * Listen to all breakpoints (or a subset via options)
 *
 * @inner
 * @param {function} callback Callback function that is called every time a breakpoint is triggered,
 * receives an array containing the breakpoint names in reverse order
 * @param {Object} [options] Listener options
 * @param {boolean} [options.isMax=false] Use `max-width`
 * @param {string} [options.immediate=true] Call the callback function on invocation
 * @returns {Object} Returns an object containing a `on` and `off` method to enable and disable the listener
 */

function listenAll(callback, options = {}) {
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
