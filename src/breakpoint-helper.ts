interface Breakpoints {
  [key: string]: string;
}

interface Methods {
  [key: string]: Function;
}

type Config = 'meta' | 'custom' | Breakpoints;
type BpNameOrNames = string | string[];
type MatchingBps = string[];

function bph(config: Config): Methods {
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
   * Generate a `meta` element with class `breakpoint-helper` and deserialize the css `font-family` value to retrieve the breakpoints.
   *
   * @private
   * @returns {Breakpoints} Breakpoint object.
   */

  function _getBpsFromMeta(): Breakpoints {
    const el = document.createElement('meta');
    el.classList.add('breakpoint-helper');
    document.getElementsByTagName('head')[0].appendChild(el);

    let fontFamily: string | string[] = window
      .getComputedStyle(el)
      .getPropertyValue('font-family');

    if (fontFamily.length <= 0) return {};

    fontFamily = fontFamily.replace(/'|"/g, '').split('&');

    return fontFamily.reduce((obj: Breakpoints, elem: string): Breakpoints => {
      const [name, value] = elem.split('=');
      obj[name] = value;
      return obj;
    }, {});
  }

  /**
   * Retrieve breakpoints by reading css custom properties on the `:root` selector, of all loaded stylesheets, starting with `--bph-`.
   *
   * @private
   * @returns {Breakpoints} Breakpoint object.
   */

  function _getBpsFromCustomProps(): Breakpoints {
    const sheets = Array.from(document.styleSheets).filter(
      (sheet: CSSStyleSheet) =>
        sheet?.href?.indexOf(window.location.origin) !== -1
    );

    const rules = [...sheets].reduce((acc, sheet) => {
      Array.from(sheet.cssRules).forEach((rule: CSSRule) => {
        if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
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
   * @param {MatchingBps} keys - Array of breakpoint names.
   * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
   *
   * @returns {string[]} Array containing matching breakpoint names in reverse order.
   */

  function _matchAll(keys: string[], useMax: boolean = false): MatchingBps {
    const matches: MatchingBps = [];
    keys.forEach((bp: string) => {
      if (isMatching(bp, useMax)) {
        matches.push(bp);
      }
    });
    return useMax ? matches : matches.reverse();
  }

  /**
   * Get all breakpoints as an object. Useful for debugging or passing breakpoint values to other libraries.
   *
   * @returns {Breakpoints} Object containing all instance breakpoints.
   */

  function getBreakpoints(): Breakpoints {
    return breakpoints;
  }

  /**
   * Get a `min-width`, `max-width` or `min-width and max-width` media query by breakpoint name.
   *
   * @param {BpNameOrNames} name - Breakpoint name or array of two breakpoint names.
   * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
   *
   * @returns {string} Media query string.
   */

  function getMediaQuery(name: BpNameOrNames, useMax: boolean = false): string {
    if (Array.isArray(name)) {
      const [min, max] = name;
      return `${getMediaQuery(min)} and ${getMediaQuery(max, true)}`;
    }

    const min = breakpoints[name];

    if (typeof min === 'undefined') {
      throw new Error(`"${name}" does not seem to be a breakpoint name`);
    }

    if (useMax) {
      const number = parseFloat(min);
      const unit = min.replace(number, '');
      const substract = unit === 'em' ? 0.0635 : 1;
      return `(max-width: ${number - substract}${unit})`;
    }

    return `(min-width: ${min})`;
  }

  /**
   * Check if a breakpoint or breakpoint range is currently matching.
   *
   * @param {BpNameOrNames} name - Breakpoint name or array of two breakpoint names.
   * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
   *
   * @returns {boolean} Whether the breakpoint or breakpoint range is matching or not.
   */

  function isMatching(name: BpNameOrNames, useMax: boolean = false): boolean {
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

  type ListenConfig = {
    name: BpNameOrNames;
    useMax?: boolean;
    immediate?: boolean;
  };

  type ListenOptions = string | ListenConfig;

  type ListenersReturn = {
    on: () => void;
    off: () => void;
  };

  function listen(
    options: ListenOptions,
    callback: (event: MediaQueryListEvent | MediaQueryList) => void
  ): ListenersReturn {
    let mq: MediaQueryList | null = null;
    const opts: ListenConfig = { name: '', useMax: false, immediate: true };

    if (typeof options === 'string' || Array.isArray(options)) {
      opts.name = options;
    } else {
      opts.name = options.name;
      opts.useMax = options.useMax || false;
      opts.immediate =
        typeof options.immediate === 'undefined' ? true : options.immediate;
    }

    function on() {
      if (typeof opts.name === 'string' || Array.isArray(opts.name)) {
        mq = window.matchMedia(getMediaQuery(opts.name));
      } else {
        mq = window.matchMedia(getMediaQuery(opts.name, opts.useMax));
      }

      if (opts.immediate) callback(mq);
      mq.addEventListener('change', callback);
    }

    on();

    function off() {
      if (mq) {
        mq.removeEventListener('change', callback);
        mq = null;
      }
    }

    return { on, off };
  }

  /**
   * Listen to all breakpoints matching or un-matching and execute a callback function. The callback function will receive an array of the matching breakpoint names in reverse order as a parameter. That means the largest breakpoint name (or smallest when using `options.useMax`) comes first in the array. The array will be empty if no breakpoints are matching.
   *
   * @param {function} callback - Callback function, receives an array of breakpoint names as parameter.
   * @param {ListenAllOptions} [options] - Configuration Object.
   * @param {string[]} [options.listenTo] - Array of breakpoint names. All are used by default.
   * @param {boolean} [options.useMax=false] - Use `max-width` instead of `min-width`.
   * @param {boolean} [options.immediate=true] - Execute callback function on listener creation.
   *
   * @returns {ListenersReturn} Object containing the `on` and `off` listener methods.
   */

  type ListenAllOptions = {
    listenTo?: string[];
    useMax?: boolean;
    immediate?: boolean;
  };

  function listenAll(
    callback: (bps: string[]) => void,
    options: ListenAllOptions = {}
  ): ListenersReturn {
    const keys = Object.keys(breakpoints);
    let listeners: ListenersReturn[] = [];
    let bps = keys;

    if (keys.length === 0) return { on: () => {}, off: () => {} };

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

    const cb = () => {
      callback(_matchAll(bps, opts.useMax));
    };

    function on() {
      bps.forEach((bp) => {
        const listener = listen(
          { name: bp, useMax: opts.useMax, immediate: false },
          cb
        );
        listeners.push(listener);
      });

      if (opts.immediate) cb();
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

  return {
    getBreakpoints,
    getMediaQuery,
    isMatching,
    listen,
    listenAll,
  };
}

export default bph;
