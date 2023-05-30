// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"7eR0q":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _index = require("../src/index");
var _indexDefault = parcelHelpers.interopDefault(_index);
var _renderExample = require("./renderExample");
// Create the instance
var bps = {
    xs: "416px",
    sm: "600px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    xxl: "1520px"
};
var instance = (0, _indexDefault.default)(bps);
var getBreakpoints = instance.getBreakpoints, getMediaQuery = instance.getMediaQuery, isMatching = instance.isMatching, listen = instance.listen, listenAll = instance.listenAll;
(0, _renderExample.renderExample)({
    subtitle: "instance - Object",
    result: instance.toString(),
    code: "import bph from 'breakpoint-helper';\n\nconst instance = bph({\n  xs: '416px',\n  sm: '600px',\n  md: '768px',\n  lg: '1024px',\n  xl: '1280px',\n  xxl: '1520px',\n});\n\nconsole.log('instance');\n\nconst {\n  getBreakpoints,\n  getMediaQuery,\n  isMatching,\n  listen,\n  listenAll,\n} = instance;"
});
var sassInstance = (0, _indexDefault.default)("meta");
(0, _renderExample.renderExample)({
    subtitle: "instance - Sass map / meta element",
    result: sassInstance.toString(),
    code: "import bph from 'breakpoint-helper';\n\nconst instance = bph('meta');\nconsole.log('instance');"
});
var cssInstance = (0, _indexDefault.default)("custom");
(0, _renderExample.renderExample)({
    subtitle: "instance - CSS custom properties",
    result: cssInstance.toString(),
    code: "import bph from 'breakpoint-helper';\n\nconst instance = bph('custom');\nconsole.log('instance');"
});
(0, _renderExample.renderExample)({
    title: "getBreakpoints()",
    code: "const bps = getBreakpoints();\nconsole.log(bps);",
    result: JSON.stringify(getBreakpoints(), null, 2)
});
(0, _renderExample.renderExample)({
    title: "getMediaQuery()",
    code: "const mq = getMediaQuery('sm');\nconsole.log(mq);",
    result: getMediaQuery("sm")
});
(0, _renderExample.renderExample)({
    title: "",
    code: "const mq = getMediaQuery('sm', true);\nconsole.log(mq);",
    result: getMediaQuery("sm", true)
});
(0, _renderExample.renderExample)({
    title: "",
    code: "const mq = getMediaQuery(['sm', 'lg']);\nconsole.log(mq);",
    result: getMediaQuery([
        "sm",
        "lg"
    ])
});
(0, _renderExample.renderExample)({
    title: "isMatching()",
    code: "const match = isMatching('sm');\nconsole.log(match);",
    result: isMatching("sm")
});
(0, _renderExample.renderExample)({
    title: "",
    code: "const match = isMatching('sm', true);\nconsole.log(match);",
    result: isMatching("sm", true)
});
(0, _renderExample.renderExample)({
    title: "",
    code: "const match = isMatching(['sm', 'lg']);\nconsole.log(match);",
    result: isMatching([
        "sm",
        "lg"
    ])
});
(function() {
    var snippet = "const listener = listen('sm', ({ matches }) => {\n  console.log(matches);\n});";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "listen()",
        useBtn: true,
        code: snippet
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listen("sm", function(param) {
        var matches = param.matches;
        result(matches);
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listen(['sm', 'lg'], ({ matches }) => {\n  console.log(matches);\n});";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listen([
        "sm",
        "lg"
    ], function(param) {
        var matches = param.matches;
        result(matches);
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listen(\n  {\n    name: 'sm',\n    useMax: true,\n  },\n  ({ matches }) => {\n    console.log(matches);\n  }\n);";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listen({
        name: "sm",
        useMax: true
    }, function(param) {
        var matches = param.matches;
        result(matches);
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listen(\n  {\n    name: 'sm',\n    immediate: false\n  },\n  ({ matches }) => {\n    console.log(matches);\n  }\n);";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet,
        result: "// Resize the window to see a result.\n// You need to move passed ".concat(bps["sm"], ".")
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listen({
        name: "sm",
        immediate: false
    }, function(param) {
        var matches = param.matches;
        result(matches);
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listen(\n  {\n    name: ['sm', 'lg'],\n    immediate: false\n  },\n  ({ matches }) => {\n    console.log(matches);\n  }\n);";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet,
        result: "// Resize the window to see a result.\n// You need to move passed ".concat(bps["sm"], " or ").concat(parseInt(bps["lg"]) - 1, "px.")
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listen({
        name: [
            "sm",
            "lg"
        ],
        immediate: false
    }, function(param) {
        var matches = param.matches;
        result(matches);
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listenAll((matches) => {\n  console.log(matches);\n});";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "listenAll()",
        useBtn: true,
        code: snippet
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listenAll(function(matches) {
        result(JSON.stringify(matches));
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listenAll(\n  (matches) => {\n    console.log(matches);\n  },\n  {\n    useMax: true,\n  }\n);";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listenAll(function(matches) {
        result(JSON.stringify(matches));
    }, {
        useMax: true
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listenAll(\n  (matches) => {\n    console.log(matches);\n  },\n  {\n    listenTo: ['sm', 'lg', 'xxl'],\n  }\n);";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listenAll(function(matches) {
        result(JSON.stringify(matches));
    }, {
        listenTo: [
            "sm",
            "lg",
            "xxl"
        ]
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listenAll(\n  (matches) => {\n    console.log(matches);\n  },\n  {\n    listenTo: ['sm', 'lg', 'xxl'],\n    useMax: true,\n  }\n);";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listenAll(function(matches) {
        result(JSON.stringify(matches));
    }, {
        listenTo: [
            "sm",
            "lg",
            "xxl"
        ],
        useMax: true
    });
    button(listener);
})();
(function() {
    var snippet = "const listener = listenAll(\n  (matches) => {\n    console.log(matches);\n  },\n  {\n    immediate: false,\n  }\n);";
    var _renderExample1 = (0, _renderExample.renderExample)({
        title: "",
        useBtn: true,
        code: snippet,
        result: "// Resize the window to see a result."
    }), result = _renderExample1.result, button = _renderExample1.button;
    var listener = listenAll(function(matches) {
        result(JSON.stringify(matches));
    }, {
        immediate: false
    });
    button(listener);
})();

},{"../src/index":"5IHkJ","./renderExample":"kbTxK","@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"5IHkJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _slicedToArray = require("@swc/helpers/_/_sliced_to_array");
var _toConsumableArray = require("@swc/helpers/_/_to_consumable_array");
/**
 * @param {Config} config - Object containing the breakpoints, `'meta'` or `'custom'`.
 *
 * @returns {Methods} Object containing the instance's methods.
 */ function bph() {
    var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _getBpsFromMeta = /**
   * Generate a `meta` element with class `breakpoint-helper` and deserialize the css `font-family` value to retrieve the breakpoints.
   *
   * @private
   * @returns {Breakpoints} Breakpoint object.
   */ function _getBpsFromMeta() {
        var el = document.createElement("meta");
        el.classList.add("breakpoint-helper");
        document.getElementsByTagName("head")[0].appendChild(el);
        var fontFamily = window.getComputedStyle(el).getPropertyValue("font-family");
        if (fontFamily.length <= 0) return {};
        fontFamily = fontFamily.replace(/'|"/g, "").split("&");
        return fontFamily.reduce(function(obj, elem) {
            var _elem_split = (0, _slicedToArray._)(elem.split("="), 2), name = _elem_split[0], value = _elem_split[1];
            obj[name] = value;
            return obj;
        }, {});
    };
    var _getBpsFromCustomProps = /**
   * Retrieve breakpoints by reading css custom properties on the `:root` selector, of all loaded stylesheets, starting with `--bph-`.
   *
   * @private
   * @returns {Breakpoints} Breakpoint object.
   */ function _getBpsFromCustomProps() {
        var sheets = Array.from(document.styleSheets).filter(function(sheet) {
            var _sheet_href;
            return (sheet === null || sheet === void 0 ? void 0 : (_sheet_href = sheet.href) === null || _sheet_href === void 0 ? void 0 : _sheet_href.indexOf(window.location.origin)) !== -1;
        });
        var rules = (0, _toConsumableArray._)(sheets).reduce(function(acc, sheet) {
            Array.from(sheet.cssRules).forEach(function(rule) {
                if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
                    var css = rule.cssText.split("{")[1].replace("}", "").split(";");
                    css.forEach(function(dec) {
                        var _dec_split = (0, _slicedToArray._)(dec.split(":"), 2), prop = _dec_split[0], val = _dec_split[1];
                        if (prop.indexOf("--bph-") !== -1) acc[prop.replace("--bph-", "").trim()] = val.trim();
                    });
                }
            });
            return acc;
        }, {});
        return rules;
    };
    var _matchAll = /**
   * Check if the breakpoints in `keys` are matching
   *
   * @private
   * @param {MatchingBps} keys - Array of breakpoint names.
   * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
   *
   * @returns {string[]} Array containing matching breakpoint names in reverse order.
   */ function _matchAll(keys) {
        var useMax = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        var matches = [];
        keys.forEach(function(bp) {
            if (isMatching(bp, useMax)) matches.push(bp);
        });
        return useMax ? matches : matches.reverse();
    };
    var getBreakpoints = /**
   * Get all breakpoints as an object. Useful for debugging or passing breakpoint values to other libraries.
   *
   * @returns {Breakpoints} Object containing all instance breakpoints.
   */ function getBreakpoints() {
        return breakpoints;
    };
    var isMatching = /**
   * Check if a breakpoint or breakpoint range is currently matching.
   *
   * @param {BpNameOrNames} name - Breakpoint name or array of two breakpoint names.
   * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
   *
   * @returns {boolean} Whether the breakpoint or breakpoint range is matching or not.
   */ function isMatching(name) {
        var useMax = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        return window.matchMedia(getMediaQuery(name, useMax)).matches;
    };
    var listen = function listen(options, callback) {
        var mq = null;
        var opts = {
            name: "",
            useMax: false,
            immediate: true
        };
        if (typeof options === "string" || Array.isArray(options)) opts.name = options;
        else {
            opts.name = options.name;
            opts.useMax = options.useMax || false;
            opts.immediate = typeof options.immediate === "undefined" ? true : options.immediate;
        }
        function on() {
            if (typeof opts.name === "string" || Array.isArray(opts.name)) mq = window.matchMedia(getMediaQuery(opts.name));
            else mq = window.matchMedia(getMediaQuery(opts.name, opts.useMax));
            if (opts.immediate) callback(mq);
            mq.addEventListener("change", callback);
        }
        on();
        function off() {
            if (mq) {
                mq.removeEventListener("change", callback);
                mq = null;
            }
        }
        return {
            on: on,
            off: off
        };
    };
    var listenAll = function listenAll(callback) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var keys = Object.keys(breakpoints);
        var listeners = [];
        var bps = keys;
        if (keys.length === 0) return {
            on: function() {},
            off: function() {}
        };
        var useMax = options.useMax, immediate = options.immediate, listenTo = options.listenTo;
        var opts = {
            useMax: useMax || false,
            immediate: typeof immediate === "undefined" ? true : immediate
        };
        if (listenTo) bps = listenTo.sort(function(a, b) {
            return parseInt(breakpoints[a], 10) - parseInt(breakpoints[b], 10);
        });
        var cb = function() {
            callback(_matchAll(bps, opts.useMax));
        };
        function on() {
            bps.forEach(function(bp) {
                var listener = listen({
                    name: bp,
                    useMax: opts.useMax,
                    immediate: false
                }, cb);
                listeners.push(listener);
            });
            if (opts.immediate) cb();
        }
        on();
        function off() {
            if (listeners.length) {
                listeners.forEach(function(listener) {
                    return listener.off();
                });
                listeners = [];
            }
        }
        return {
            on: on,
            off: off
        };
    };
    var breakpoints = {};
    if (typeof config === "string" && config === "meta") breakpoints = _getBpsFromMeta();
    else if (typeof config === "string" && config === "custom") breakpoints = _getBpsFromCustomProps();
    else breakpoints = config;
    if (Object.keys(breakpoints).length === 0) throw new Error("No breakpoints defined");
    /**
   * Get a `min-width`, `max-width` or `min-width and max-width` media query by breakpoint name.
   *
   * @param {BpNameOrNames} name - Breakpoint name or array of two breakpoint names.
   * @param {boolean} [useMax=false] - Use `max-width` instead of `min-width`.
   *
   * @returns {string} Media query string.
   */ function getMediaQuery(name) {
        var useMax = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        if (Array.isArray(name)) {
            var _name = (0, _slicedToArray._)(name, 2), min = _name[0], max = _name[1];
            return "".concat(getMediaQuery(min), " and ").concat(getMediaQuery(max, true));
        }
        var min1 = breakpoints[name];
        if (typeof min1 === "undefined") throw new Error('"'.concat(name, '" does not seem to be a breakpoint name'));
        if (useMax) {
            var number = parseFloat(min1);
            var unit = min1.replace(number, "");
            var substract = unit === "em" ? 0.0635 : 1;
            return "(max-width: ".concat(number - substract).concat(unit, ")");
        }
        return "(min-width: ".concat(min1, ")");
    }
    return {
        getBreakpoints: getBreakpoints,
        getMediaQuery: getMediaQuery,
        isMatching: isMatching,
        listen: listen,
        listenAll: listenAll
    };
}
exports.default = bph;

},{"@swc/helpers/_/_sliced_to_array":"5rqad","@swc/helpers/_/_to_consumable_array":"bprJq","@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"5rqad":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_sliced_to_array", function() {
    return _sliced_to_array;
});
parcelHelpers.export(exports, "_", function() {
    return _sliced_to_array;
});
var _arrayWithHolesJs = require("./_array_with_holes.js");
var _iterableToArrayLimitJs = require("./_iterable_to_array_limit.js");
var _nonIterableRestJs = require("./_non_iterable_rest.js");
var _unsupportedIterableToArrayJs = require("./_unsupported_iterable_to_array.js");
function _sliced_to_array(arr, i) {
    return (0, _arrayWithHolesJs._array_with_holes)(arr) || (0, _iterableToArrayLimitJs._iterable_to_array_limit)(arr, i) || (0, _unsupportedIterableToArrayJs._unsupported_iterable_to_array)(arr, i) || (0, _nonIterableRestJs._non_iterable_rest)();
}

},{"./_array_with_holes.js":"azpM6","./_iterable_to_array_limit.js":"9VzDD","./_non_iterable_rest.js":"kRmiU","./_unsupported_iterable_to_array.js":"5hrVY","@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"azpM6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_array_with_holes", function() {
    return _array_with_holes;
});
parcelHelpers.export(exports, "_", function() {
    return _array_with_holes;
});
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"jIm8e":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function get() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"9VzDD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_iterable_to_array_limit", function() {
    return _iterable_to_array_limit;
});
parcelHelpers.export(exports, "_", function() {
    return _iterable_to_array_limit;
});
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"kRmiU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_non_iterable_rest", function() {
    return _non_iterable_rest;
});
parcelHelpers.export(exports, "_", function() {
    return _non_iterable_rest;
});
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"5hrVY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_unsupported_iterable_to_array", function() {
    return _unsupported_iterable_to_array;
});
parcelHelpers.export(exports, "_", function() {
    return _unsupported_iterable_to_array;
});
var _arrayLikeToArrayJs = require("./_array_like_to_array.js");
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return (0, _arrayLikeToArrayJs._array_like_to_array)(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0, _arrayLikeToArrayJs._array_like_to_array)(o, minLen);
}

},{"./_array_like_to_array.js":"gOZpJ","@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"gOZpJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_array_like_to_array", function() {
    return _array_like_to_array;
});
parcelHelpers.export(exports, "_", function() {
    return _array_like_to_array;
});
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"bprJq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_to_consumable_array", function() {
    return _to_consumable_array;
});
parcelHelpers.export(exports, "_", function() {
    return _to_consumable_array;
});
var _arrayWithoutHolesJs = require("./_array_without_holes.js");
var _iterableToArrayJs = require("./_iterable_to_array.js");
var _nonIterableSpreadJs = require("./_non_iterable_spread.js");
var _unsupportedIterableToArrayJs = require("./_unsupported_iterable_to_array.js");
function _to_consumable_array(arr) {
    return (0, _arrayWithoutHolesJs._array_without_holes)(arr) || (0, _iterableToArrayJs._iterable_to_array)(arr) || (0, _unsupportedIterableToArrayJs._unsupported_iterable_to_array)(arr) || (0, _nonIterableSpreadJs._non_iterable_spread)();
}

},{"./_array_without_holes.js":"1euph","./_iterable_to_array.js":"3aBit","./_non_iterable_spread.js":"1jxR2","./_unsupported_iterable_to_array.js":"5hrVY","@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"1euph":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_array_without_holes", function() {
    return _array_without_holes;
});
parcelHelpers.export(exports, "_", function() {
    return _array_without_holes;
});
var _arrayLikeToArrayJs = require("./_array_like_to_array.js");
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return (0, _arrayLikeToArrayJs._array_like_to_array)(arr);
}

},{"./_array_like_to_array.js":"gOZpJ","@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"3aBit":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_iterable_to_array", function() {
    return _iterable_to_array;
});
parcelHelpers.export(exports, "_", function() {
    return _iterable_to_array;
});
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"1jxR2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "_non_iterable_spread", function() {
    return _non_iterable_spread;
});
parcelHelpers.export(exports, "_", function() {
    return _non_iterable_spread;
});
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}],"kbTxK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "root", function() {
    return root;
});
parcelHelpers.export(exports, "renderExample", function() {
    return renderExample;
});
var root = document.getElementById("root");
function mergeObjects() {
    var resObj = {};
    for(var i = 0; i < arguments.length; i += 1){
        var obj = arguments[i], keys = Object.keys(obj);
        for(var j = 0; j < keys.length; j += 1)resObj[keys[j]] = obj[keys[j]];
    }
    return resObj;
}
function renderExample() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var defaults = {
        title: "",
        subtitle: "",
        useBtn: false,
        code: "",
        result: ""
    };
    var settings = mergeObjects({}, defaults, options);
    var title = settings.title, subtitle = settings.subtitle, useBtn = settings.useBtn, code = settings.code, result = settings.result;
    var h2 = document.createElement("h2");
    var example = document.createElement("div");
    var exampleCode = document.createElement("div");
    var exampleResult = document.createElement("div");
    var codePre = document.createElement("pre");
    var resultPre = document.createElement("pre");
    var button = document.createElement("button");
    example.classList.add("example");
    example.appendChild(exampleCode);
    example.appendChild(exampleResult);
    exampleCode.classList.add("example_item", "example_item-code");
    exampleCode.appendChild(codePre);
    exampleResult.classList.add("example_item", "example_item-result");
    exampleResult.appendChild(resultPre);
    codePre.classList.add("example_pre", "example_pre-code");
    resultPre.classList.add("example_pre", "example_pre-result");
    h2.innerHTML = "<code>".concat(title, "</code> ").concat(subtitle);
    codePre.innerHTML = "<code>".concat(code, "</code>");
    resultPre.innerHTML = "<code>".concat(result, "</code>");
    if (title) root.appendChild(h2);
    if (subtitle) {
        h2.innerHTML = subtitle;
        root.appendChild(h2);
    }
    if (code || result) root.appendChild(example);
    if (useBtn) {
        button.innerHTML = "Disable";
        exampleCode.appendChild(button);
        codePre.classList.add("example_pre-button");
    }
    var isActive = true;
    return {
        code: function(txt) {
            codePre.innerHTML = "<code>".concat(txt, "</code>");
        },
        result: function(txt) {
            resultPre.innerHTML = "<code>".concat(txt, "</code>");
        },
        button: function() {
            var listener = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
            if (!listener) return;
            button.addEventListener("click", function() {
                if (isActive) {
                    listener.off();
                    resultPre.innerHTML = "<code>// listener.off() was called!\n// The listener is currently disabled</code>";
                    button.innerHTML = "Enable";
                    resultPre.classList.toggle("example_pre-disabled");
                } else {
                    resultPre.innerHTML = "".concat(result);
                    button.innerHTML = "Disable";
                    resultPre.classList.toggle("example_pre-disabled");
                    listener.on();
                }
                isActive = !isActive;
            });
        }
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}]},["7eR0q"], "7eR0q", "parcelRequireceef")

//# sourceMappingURL=test.153cae05.js.map
