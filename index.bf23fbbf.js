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
})({"dkjI6":[function(require,module,exports) {
var _toConsumableArray = require("@swc/helpers/_/_to_consumable_array");
var doc = document.documentElement;
// Update color
window.addEventListener("message", function(event) {
    if (event.origin !== window.location.origin) return;
    if (typeof event.data !== "string") return;
    doc.style.setProperty("--link-color", event.data);
});
// Handle Resize
var resizer = document.querySelector(".resizer-inner");
var dragger = document.querySelector(".resizer-dragger");
dragger.addEventListener("pointerdown", initDrag, false);
var startX, startWidth;
function initDrag(e) {
    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(resizer).width, 10);
    doc.addEventListener("pointermove", doDrag, false);
    doc.addEventListener("pointerup", stopDrag, false);
}
function doDrag(e) {
    resizer.style.width = startWidth + e.clientX - startX + "px";
}
function stopDrag(e) {
    doc.removeEventListener("pointermove", doDrag, false);
    doc.removeEventListener("pointerup", stopDrag, false);
}
// Handle Menu
var anchors = (0, _toConsumableArray._)(document.querySelectorAll('#toc a[href^="#"]'));
var headings = getHeadings();
function getHeadings() {
    headings = (0, _toConsumableArray._)(document.querySelectorAll("h2[id],h3[id]")).map(function(heading) {
        return {
            id: heading.id,
            top: document.getElementById(heading.id).getBoundingClientRect().top + window.scrollY
        };
    });
}
function onScroll() {
    var sortedHeadings = headings.concat([]).sort(function(a, b) {
        return a.top - b.top;
    });
    var top = window.pageYOffset + window.innerHeight / 3;
    var current = sortedHeadings[0].id;
    for(var i = 0; i < sortedHeadings.length; i++)if (top >= sortedHeadings[i].top) current = sortedHeadings[i].id;
    anchors.forEach(function(anchor) {
        anchor.parentElement.classList.remove("active");
    });
    var newAnchor = anchors.find(function(anchor) {
        return anchor.href.split("#")[1] === current;
    });
    if (!newAnchor) return;
    newAnchor.parentElement.classList.add("active");
    if (newAnchor.classList.contains("sub-item")) newAnchor.parentElement.parentElement.parentElement.classList.add("active");
}
window.addEventListener("scroll", onScroll, {
    capture: true,
    passive: true
});
var resizeObserver = new window.ResizeObserver(function() {
    getHeadings();
});
resizeObserver.observe(document.body);
getHeadings();
onScroll();

},{"@swc/helpers/_/_to_consumable_array":"bprJq"}],"bprJq":[function(require,module,exports) {
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

},{}],"3aBit":[function(require,module,exports) {
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

},{"./_array_like_to_array.js":"gOZpJ","@parcel/transformer-js/src/esmodule-helpers.js":"jIm8e"}]},["dkjI6"], "dkjI6", "parcelRequireceef")

//# sourceMappingURL=index.bf23fbbf.js.map
