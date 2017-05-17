/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Particle(particle) {
  if (!(this instanceof Particle)) {
    return new Particle(particle);
  }
  Object.defineProperty(this, 'id', { value: particle });
}

Particle.prototype = {
  toString: function () {
    return this.id;
  },
  toSource: function () {
    return 'P("' + this.id + '")';
  }
};

Particle.addMod = function (name, toStringGenerator) {
  Particle.prototype[name] = function (/* ... */) {
    var superToString = this.toString;
    var newP = Object.create(this);
    var toString = toStringGenerator.apply(newP, arguments);
    Object.defineProperty(newP, 'toString', { value: function (after, before) {
      if (arguments.length === 0) {
        return Particle.prototype.toString.apply(this);
      }
      var _ret = toString.apply(this, arguments);
      return (typeof _ret !== 'undefined') ? _ret : superToString.apply(this, arguments);
    }});
    return newP;
  };
};

function contextMatches(where, when, after, before) {
  var val = {
    before: after,
    after: before
  }[where];
  return (when === (val || '') || (when === '*' && typeof val !== 'undefined'));
}

Particle.addMod('mutates', function (mutatesWhere, mutatesWhen, mutatesTo) {
  return function (after, before) {
    if (contextMatches(mutatesWhere, mutatesWhen, after, before)) {
      return mutatesTo;
    }
  };
});

Particle.addMod('looses', function (loosesWhere, loosesWhen, loosesHowMuch) {
  var oldToString = this.toString;
  return function (after, before) {
    var v;
    if (contextMatches(loosesWhere, loosesWhen, after, before)) {
      v = oldToString.apply(this, arguments);
      return v.substr(0, v.length - loosesHowMuch);
    }
  };
});

Particle.addMod('asSuffix', function () {
  return function (after, before) {
    if (!before) return '';
  };
});

Particle.addMod('asPrefix', function () {
  return function (after, before) {
    if (!after) return '';
  };
});

Particle.addMod('asJoiner', function () {
  return function (after, before) {
    if (!after || !before) return '';
  };
});

Particle.addMod('hides', function (hidesWhere, hidesWhen) {
  return function (after, before) {
    if (contextMatches(hidesWhere, hidesWhen, after, before)) {
      return '';
    }
  };
});

function psToSource(ps) {
  return ps.map(function (p) {
    return p.toSource ? p.toSource() : ('String("' + String(p) + '")');
  }).join(', ');
}

function conditionalToString(p, k, ps) {
  return p && p.toString(ps[k+1] && String(ps[k+1]), ps[k-1] && String(ps[k-1]));
}

function Particles(ps) {
  if (arguments.length > 1) {
    ps = Array.prototype.slice.call(arguments);
  }
  if (!(this instanceof Particles)) {
    return new Particles(ps);
  }

  this.toString = function () {
    if (typeof this._string === 'undefined') {
      this._string = ps.filter(conditionalToString)
        .map(conditionalToString)
        .join('');
    }
    return this._string;
  };

  this.toSource = function () {
    return 'Ps([' + psToSource(ps) + '])';
  };
}

function Words(ps) {
  if (arguments.length > 1) {
    ps = Array.prototype.slice.call(arguments);
  }
  if (!(this instanceof Words)) {
    return new Words(ps);
  }

  this.toString = function () {
    if (typeof this._string === 'undefined') {
      this._string = ps.filter(conditionalToString)
        .map(conditionalToString)
        .join(' ');
    }
    return this._string;
  };

  this.toSource = function () {
    return 'Ws([' + psToSource(ps) + '])';
  };
}

exports.Particles = Particles;
exports.Particle = Particle;
exports.Words = Words;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.withOverrides = function (overrides, algo, val) {
  if (overrides[val]) {
    return overrides[val];
  }
  return algo(val);
};

exports.firstPropFrom = function (object, i) {
  for (;; ++i) {
    if (object.hasOwnProperty(i)) {
      return object[i];
    }
  }
};

exports.splitHandle = function (opts, val) {
  var pos = val.length - opts.cutOffLowest;
  var handleHigherPart = opts.handleHigherPart || opts.handleParts;
  var handleLowerPart = opts.handleLowerPart || opts.handleParts;
  return opts.join(handleHigherPart(val.substr(0, pos)),
    handleLowerPart(val.substr(pos)));
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = kansuji;

kansuji.KANJI_DIGITS     = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
kansuji.KANJI_UNITS      = ["十", "百", "千", "万", "億", "兆", "京", "垓", "禾予", "穣", "溝", "澗", "正", "載"];
kansuji.DAIJI_DIGITS     = ["〇", "壱", "弐", "参", "四", "五", "六", "七", "八", "九"];
kansuji.DAIJI_UNITS      = ["拾"].concat(kansuji.KANJI_UNITS.slice(1))
kansuji.OLD_DAIJI_DIGITS = ["零", "壱", "弐", "参", "肆", "伍", "陸", "漆", "捌", "玖"];
kansuji.OLD_DAIJI_UNITS  = ["拾", "佰", "阡", "萬"].concat(kansuji.KANJI_UNITS.slice(4))
kansuji.DOT = "・";
kansuji.PLUS = "＋";
kansuji.MINUS = "−";
kansuji.REGEXP = /^\s*([-+])?([0-9]+)(?:\.([0-9]+))?/;
kansuji.WIDE_REGEXP = /^[\s　]*([-+−＋])?([0-9０１２３４５６７８９]+)(?:[\.．]([0-9０１２３４５６７８９]+))?/;

function kansuji(n, options) {
  if (typeof n === "number" && isNaN(n)) throw new TypeError("NaN can't be converted");
  if (n === Infinity) throw new TypeError("Infinity can't be converted");
  if (n === -Infinity) throw new TypeError("-Infinity can't be converted");

  options = options || {};
  if (typeof options.units !== "undefined") options.unit = options.units; // alias
  var unit = typeof options.unit === "undefined" ? true  : options.unit;
  var ichi = typeof options.ichi === "undefined" ? false : options.ichi;
  var daiji = typeof options.daiji === "undefined" ? false : options.daiji;
  var wide = typeof options.wide === "undefined" ? false : options.wide;

  var ichiDict = buildIchiDict(ichi);
  var kanjiDigits, kanjiUnits;
  if (daiji === "old") {
    kanjiDigits = kansuji.OLD_DAIJI_DIGITS;
    kanjiUnits  = kansuji.OLD_DAIJI_UNITS;
  } else if (daiji) {
    kanjiDigits = kansuji.DAIJI_DIGITS;
    kanjiUnits  = kansuji.DAIJI_UNITS;
  } else {
    kanjiDigits = kansuji.KANJI_DIGITS;
    kanjiUnits  = kansuji.KANJI_UNITS;
  }

  var matched = n.toString().match(wide ? kansuji.WIDE_REGEXP : kansuji.REGEXP);
  if (!matched) {
    throw new TypeError("Non-number string can't be converted");
  }

  var converted = convert(matched[2], false);
  if (typeof matched[3] !== "undefined") {
    var decConverted = convert(matched[3], true);
    if (decConverted !== "") converted += kansuji.DOT + decConverted;
  }
  if (matched[1] === "+" || matched[1] === "＋") converted = kansuji.PLUS + converted;
  if (matched[1] === "-" || matched[1] === "−") converted = kansuji.MINUS + converted;
  return converted;

  function buildIchiDict() {
    if (ichi instanceof Array) {
      return [
        false,
        (ichi.indexOf(10)   !== -1),
        (ichi.indexOf(100)  !== -1),
        (ichi.indexOf(1000) !== -1)
      ];
    } else {
      return [false, !!ichi, !!ichi, !!ichi];
    }
  }

  function convert(str, isDecimal) {
    var out = [], keta = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i);

      if (code >= 0xFF10 && code <= 0xFF19) {
        // Wide number to ASCII
        code -= (0xFF10 - 0x30);
      }

      if (code === 0x30) {
        // "0"
        if (!unit || (isDecimal && out.length !== 0)) {
          out.unshift(kanjiDigits[0]);
        }
        keta++;
      } else {
        // "1" - "9"
        if (unit && !isDecimal) {
          var r = keta % 4;
          if (r === 1 || r === 2 || r === 3) {  // 10, 100, 1000
            out.unshift(kanjiUnits[r - 1]);
            if (code === /* "1" */0x31 && !ichiDict[r]) {
              keta++;
              continue;
            }
          } else if (r === 0 && keta !== 0) {   // 10000, 100000000, ...
            out.unshift(kanjiUnits[(keta / 4) + 2] || "");
          }
        }
        out.unshift(kanjiDigits[code - 0x30]);
        keta++;
      }
    }

    if (out.length === 0 && !isDecimal) {
      out.push(kanjiDigits[0]);
    }

    return out.join("");
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {

	var myanmarNumbers = __webpack_require__(16);
	var romannumerals = __webpack_require__(17);
	__webpack_require__(19);

	// takes an ordered array of characters
	// returns a function that maps [0-9a-z]* to those characters
	var getCharRemapper = function getCharRemapper(arrayOfCharsToMapTo) {
		var charRemapper = function charRemapper(uptoBase36Number) {
			// 36=0-9a-z
			return uptoBase36Number.toString().split('').map(function (ch) {
				if (ch === '.' || ch === ',') return ch;
				if (isNaN(Number(ch))) {
					return arrayOfCharsToMapTo[ch.charCodeAt(0) - 87]; // lowercase a-z
				} else {
					return arrayOfCharsToMapTo[Number(ch)];
				}
			}).join('');
		};
		return charRemapper;
	};

	var catchZero = function catchZero(f) {
		return function (n) {
			return n == 0 ? '' : f(n);
		};
	};

	var toBase20 = function () {
		var encode = function encode(num) {
			var alphabet = "0123456789abcdefghij";
			var base = alphabet.length;
			var mod, str;
			if (!/^\d+$/.test(num)) {
				throw new Error('not an integer');
			}
			if (typeof num !== 'number') {
				num = parseInt(num);
			}
			str = '';
			while (num >= base) {
				mod = num % base;
				str = alphabet[mod] + str;
				num = (num - mod) / base;
			}
			return alphabet[num] + str;
		};
		return encode;
	}();

	var systems = {
		japanese: {
			title: 'Chinese',
			convert: __webpack_require__(2),
			meta: { era: '1400BC –' },
			link: 'https://en.wikipedia.org/wiki/Chinese_numerals'
		},
		chinese: {
			title: 'Chinese Finance',
			convert: __webpack_require__(2),
			meta: { era: '1400BC –' },
			link: 'https://en.wikipedia.org/wiki/Chinese_numerals'
		},
		eastarabic: {
			title: 'Arabic (East)',
			convert: getCharRemapper(["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"]),
			meta: { era: '700 –' }
		},
		hebrew: {
			title: 'Hebrew',
			convert: __webpack_require__(8),
			meta: { era: '100BC –' }
		},
		aegean: {
			title: 'Aegean',
			convert: catchZero(__webpack_require__(6)),
			meta: { era: '1700BC – 1100BC' }
		},
		morse: {
			title: 'Morse',
			convert: __webpack_require__(14),
			meta: { era: '1836 –' }
		},
		roman: {
			title: 'Roman',
			convert: function convert(n) {
				return romannumerals.toRoman(n);
			},
			meta: { era: '850BC – 300AD' }
		},
		myanmar: {
			title: "Myanmar",
			convert: function convert(n) {
				return myanmarNumbers(n, 'my');
			},
			meta: { era: '1400 –' }
		},
		binary: {
			title: "Binary",
			convert: function convert(n) {
				return __webpack_require__(18);
			}, meta: { era: '1679 –' }
		},
		english: {
			title: "",
			convert: __webpack_require__(9).en, meta: {}
		},
		mayan: {
			title: "Mayan",
			extra: 'Base 20',
			meta: { era: '36BC – 1650' },
			convert: _.compose(getCharRemapper("ABCDEFGHIJKLMNOPQRST".split('')), toBase20)
		},
		persian: {
			title: "Persian",
			convert: function convert(n) {
				return persianJs(n + "").englishNumber().toString();
			},
			meta: {}
		}
	};

	return systems;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return _;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */

var Zepto = module.exports = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (isDocument(element) && isSimple && maybeID) ?
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        isSimple && !maybeID ?
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var computedStyle, element = this[0]
        if(!element) return
        computedStyle = getComputedStyle(element, '')
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (isFunction(data) || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
         (!options || options.cache !== true) &&
         ('script' == dataType || 'jsonp' == dataType)
        ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function($){
  $.fn.serializeArray = function() {
    var name, type, result = [],
      add = function(value) {
        if (value.forEach) return value.forEach(add)
        result.push({ name: name, value: value })
      }
    if (this[0]) $.each(this[0].elements, function(_, field){
      type = field.type, name = field.name
      if (name && field.nodeName.toLowerCase() != 'fieldset' &&
        !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
        ((type != 'radio' && type != 'checkbox') || field.checked))
          add($(field).val())
    })
    return result
  }

  $.fn.serialize = function(){
    var result = []
    this.serializeArray().forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

  $.fn.submit = function(callback) {
    if (0 in arguments) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.isDefaultPrevented()) this.get(0).submit()
    }
    return this
  }

})(Zepto)

;(function($){
  // __proto__ doesn't exist on IE<11, so redefine
  // the Z function to use object extension instead
  if (!('__proto__' in {})) {
    $.extend($.zepto, {
      Z: function(dom, selector){
        dom = dom || []
        $.extend(dom, $.fn)
        dom.selector = selector || ''
        dom.__Z = true
        return dom
      },
      // this is a kludge but works
      isZ: function(object){
        return $.type(object) === 'array' && '__Z' in object
      }
    })
  }

  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try {
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})(Zepto)

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

function aegean(input, convertToArabicNumerals) {
  input += '';

  var tenks = ['𐄫','𐄬','𐄭','𐄮','𐄯','𐄰','𐄱','𐄲','𐄳'];
  var ks = ['𐄢','𐄣','𐄤','𐄥','𐄦','𐄧','𐄨','𐄩','𐄪'];
  var hundreds = ['𐄙','𐄚','𐄛','𐄜','𐄝','𐄞','𐄟','𐄠','𐄡'];
  var tens = ['𐄐','𐄑','𐄒','𐄓','𐄔','𐄕','𐄖','𐄗','𐄘'];
  var ones = ['𐄇','𐄈','𐄉','𐄊','𐄋','𐄌','𐄍','𐄎','𐄏'];

  if (convertToArabicNumerals) {
    // convert from Aegean numerals to Arabic numerals
    var placevals = [ones, tens, hundreds, ks, tenks];
    var replacements = [];
    var numeralchain = 0;
    var lastpv = 100;

    for (var c = 0; c < input.length; c++) {
      var char = input.slice(c, c + 2);
      var isNumeral = false;
      for (var pv = 0; pv < placevals.length; pv++) {
        if (placevals[pv].indexOf(char) > -1) {
          if (lastpv < pv) {
            throw 'place values in wrong order';
          } else if (lastpv === pv) {
            throw 'place value repeats';
          }
          lastpv = pv;
          numeralchain += (placevals[pv].indexOf(char) + 1) * Math.pow(10, pv);
          isNumeral = true;
          c++;
          break;
        }
      }
      if (isNumeral) {
        continue;
      }

      // didn't find a digit in this char, when previous char had digits
      if (numeralchain) {
        replacements.push(numeralchain);
        numeralchain = 0;
        lastpv = 100;
      }
    }
    if (numeralchain) {
      // numeral at end of the string
      replacements.push(numeralchain);
    }
    for (var r = 0; r < replacements.length; r++) {
      input = input.replace(aegean(replacements[r]), replacements[r]);
    }
    if (!isNaN(input * 1)) {
      return input * 1;
    } else {
      return input;
    }
  } else {
    // convert from Arabic numerals to Aegean numerals
    var numerals = input.match(/[-]?\d+[\.\d+]?/g);
    if (!numerals) {
      numerals = [];
    }
    // console.log(numerals);
    for (var n = 0; n < numerals.length; n++) {
      var conversion = 1 * numerals[n];
      if (conversion !== Math.round(conversion)) {
        throw 'decimals not supported';
      }
      if (conversion === 0) {
        throw 'zero not supported';
      }
      if (conversion < 0) {
        throw 'negative numbers not supported';
      }
      if (conversion >= 100000) {
        throw 'numbers >= 100,000 not supported';
      }

      var output = '';
      while (conversion > 0) {
        var digit = 1 * (conversion + '')[0];
        if (conversion >= 10000) {
          conversion -= 10000 * digit;
          output += tenks[digit - 1];
        } else if (conversion >= 1000) {
          conversion -= 1000 * digit;
          output += ks[digit - 1];
        } else if (conversion >= 100) {
          conversion -= 100 * digit;
          output += hundreds[digit - 1];
        } else if (conversion >= 10) {
          conversion -= 10 * digit;
          output += tens[digit - 1];
        } else {
          conversion -= digit;
          output += ones[digit - 1];
        }
      }
      input = input.replace(numerals[n], output);
    }
    return input;
  }
}

/* Array.indexOf polyfill from Mozilla Dev Network */
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var o = Object(this);
    var len = o.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) {
      n = 0;
    }
    if (n >= len) {
      return -1;
    }
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

/* NodeJS module support */
if (true) {
  module.exports = aegean;
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window._ = __webpack_require__(4);
var $ = __webpack_require__(5);
window.alts = __webpack_require__(3);

var $dom = {
	aNumber: $('#a-number'),
	plus: $('#plus'),
	minus: $('#minus'),
	random: $('#random'),
	notations: {
		english: $('#english b'), japanese: $('#japanese b'),
		myanmar: $('#myanmar b'), chinese: $('#chinese b'),
		aegean: $('#aegean b'), roman: $('#roman b'),
		hebrew: $('#hebrew b'), binary: $('#binary b'),
		morse: $('#morse b'), eastarabic: $('#eastarabic b'),
		mayan: $('#mayan b'), persian: $('#persian b')
	}
};

var Incrementing = {
	on: function on() {
		Incrementing.off();Incrementing.id = setInterval(function () {
			return NumNum.nudgeBy(1);
		}, 150);
	},
	off: function off() {
		clearInterval(Incrementing.id);Incrementing.id = null;
	}
};
var Decrementing = {
	on: function on() {
		Decrementing.off();Decrementing.id = setInterval(function () {
			return NumNum.nudgeBy(-1);
		}, 150);
	},
	off: function off() {
		clearInterval(Decrementing.id);Decrementing.id = null;
	}
};
var Randomising = {
	on: function on() {
		Randomising.off();Randomising.id = setInterval(function () {
			return NumNum.randomise();
		}, 1300);
	},
	off: function off() {
		clearInterval(Randomising.id);Randomising.id = null;
	}
};

var cancelPresses = function cancelPresses() {
	$('button').removeClass('pressed');
	Incrementing.off();
	Decrementing.off();
	Randomising.off();
};

///

$(window).on('mouseup', cancelPresses);
$(window).on('touchend', cancelPresses);

$dom.aNumber.keyup(function (k) {
	return NumNum.onChange(NumNum.get());
});

var buttonDown = {
	plus: function plus(ev) {
		$dom.plus.addClass('pressed');
		NumNum.nudgeBy(1);
		Incrementing.on();
		ev.preventDefault();
	},
	minus: function minus(ev) {
		$dom.minus.addClass('pressed');
		NumNum.nudgeBy(-1);
		Decrementing.on();
		ev.preventDefault();
	},
	random: function random(ev) {
		$dom.random.addClass('pressed');
		NumNum.randomise();
		Randomising.on();
		ev.preventDefault();
	}
};

$dom.plus.on('mousedown', buttonDown.plus.bind(buttonDown));
$dom.minus.on('mousedown', buttonDown.minus.bind(buttonDown));
$dom.random.on('mousedown', buttonDown.random.bind(buttonDown));

$dom.plus.on('touchstart', buttonDown.plus.bind(buttonDown));
$dom.minus.on('touchstart', buttonDown.minus.bind(buttonDown));
$dom.random.on('touchstart', buttonDown.random.bind(buttonDown));

// $dom.random.on('webkitmouseforcechanged', (ev) => console.log(ev))

_.each(alts, function (v, k) {
	var metaHTML = '<div id="meta">';
	if (v.title) {
		metaHTML += '<h2>' + v.title + '</h2>';
	}
	if (v.meta.era) {
		metaHTML += '<em>' + v.meta.era + '</em>';
	}
	if (v.extra) {
		metaHTML += '<span>' + v.extra + '</span>';
	}
	metaHTML += '</div>';

	$dom.notations[k].parent().append(metaHTML);
	// if (v.meta.link) $dom.notations[k].parent().append(`<a href="${v.meta.link}">i</a>`)
});

var NumNum = {
	get: function get() {
		return $dom.aNumber.val() - 0;
	},
	nudgeBy: function nudgeBy(byN) {
		var nowN = NumNum.get();
		if (nowN + byN >= 0) {
			NumNum.set(nowN + byN);
		}
	},
	randomise: function randomise() {
		return NumNum.set(Math.floor(1 + Math.random() * 9999));
	},
	set: function set(n) {
		$dom.aNumber.val(n);
		NumNum.onChange(n);
	},
	onChange: function onChange(n) {
		// position pixel
		$dom.notations.english.text(alts.english.convert(n));
		$dom.notations.aegean.text(alts.aegean.convert(n));
		$dom.notations.roman.text(alts.roman.convert(n));
		$dom.notations.myanmar.text(alts.myanmar.convert(n));
		$dom.notations.hebrew.text(alts.hebrew.convert(n));
		$dom.notations.chinese.text(alts.chinese.convert(n, { daiji: true }));
		$dom.notations.japanese.text(alts.japanese.convert(n));
		$dom.notations.binary.text(alts.binary.convert()(n));
		$dom.notations.eastarabic.text(alts.eastarabic.convert(n));
		$dom.notations.morse.text(alts.morse.convert.encode('' + n));
		$dom.notations.mayan.html(alts.mayan.convert(n).split('').join('<br>'));
		$dom.notations.persian.html(alts.persian.convert(n));
	}
};

NumNum.randomise();

///////


// var hammerPlus = new Hammer($dom.plus[0])
// hammerPlus.get("press").set({ time:10 })
//
// var hammerMinus= new Hammer($dom.minus[0])
// hammerMinus.get("press").set({ time:10 })
//
// var hammerRandom = new Hammer($dom.random[0])
// hammerRandom.get("press").set({ time:10 })
// hammerPlus.on('press', (ev) => Incrementing.on() )
// hammerMinus.on('press', (ev) => Decrementing.on() )
// hammerRandom.on('press', (ev) => Randomising.on() )

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Convert numbers to gematriya representation, and vice-versa.
 *
 * Licensed MIT.
 *
 * Copyright (c) 2014 Eyal Schachter

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(){
	var letters = {}, numbers = {
		'': 0,
		א: 1,
		ב: 2,
		ג: 3,
		ד: 4,
		ה: 5,
		ו: 6,
		ז: 7,
		ח: 8,
		ט: 9,
		י: 10,
		כ: 20,
		ל: 30,
		מ: 40,
		נ: 50,
		ס: 60,
		ע: 70,
		פ: 80,
		צ: 90,
		ק: 100,
		ר: 200,
		ש: 300,
		ת: 400,
		תק: 500,
		תר: 600,
		תש: 700,
		תת: 800,
		תתק: 900,
		תתר: 1000
	}, i;
	for (i in numbers) {
		letters[numbers[i]] = i;
	}

	function gematriya(num, limit) {
		if (typeof num !== 'number' && typeof num !== 'string') {
			throw new TypeError('non-number or string given to gematriya()');
		}
		var str = typeof num === 'string';
		if (str) {
			num = num.replace(/('|")/g,'');
		}
		num = num.toString().split('').reverse();
		if (!str && limit) {
			num = num.slice(0, limit);
		}

		num = num.map(function g(n,i){
			if (str) {
				return limit && numbers[n] < numbers[num[i - 1]] && numbers[n] < 100 ? numbers[n] * 1000 : numbers[n];
			} else {
				if (parseInt(n, 10) * Math.pow(10, i) > 1000) {
					return g(n, i-3);
				}
				return letters[parseInt(n, 10) * Math.pow(10, i)];
			}
		});

		if (str) {
			return num.reduce(function(o,t){
				return o + t;
			}, 0);
		} else {
			num = num.reverse().join('').replace(/יה/g,'טו').replace(/יו/g,'טז').split('');

			if (num.length === 1) {
				num.push("'");
			} else if (num.length > 1) {
				num.splice(-1, 0, '"');
			}

			return num.join('');
		}
	}

	if (true) {
		module.exports = gematriya;
	} else {
		window.gematriya = gematriya;
	}
})();


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.de = __webpack_require__(10);
exports.en = __webpack_require__(11);
exports.pl = __webpack_require__(12);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

var particles = __webpack_require__(0);
var P = particles.Particle;
var Particles = particles.Particles;

var lessThanHundred = (function () {
  var atoms = {
     0: P('null').hides('after', '*').hides('before', '*'),
     2: P('zwei').mutates('before', 'zig', 'zwan'),
     3: 'drei',
     4: 'vier',
     5: 'fünf',
     6: P('sechs').looses('before', 'zehn', 1).looses('before', 'zig', 1),
     7: P('sieben').looses('before', 'zehn', 2).looses('before', 'zig', 2),
     8: 'acht',
     9: 'neun',
    11: 'elf',
    12: 'zwölf'
  };
  var atomsByGender = {
    f: Object.create(atoms),
    m: Object.create(atoms)
  };
  atomsByGender.f['1'] = P('eine').mutates('before', 'zig', 'ze');
  atomsByGender.m['1'] = P('eins').looses('before', '*', 1)
    .mutates('before', 'zig', 'ze');

  var tenUnd = P('und').hides('before', 'zehn').asJoiner();
  var tenZig = P('zig').asSuffix()
    .mutates('after', 'drei', 'ßig')
    .mutates('after', 'eine', 'hn')
    .mutates('after', 'eins', 'hn');

  return function (val, params) {
    return utils.withOverrides(atomsByGender[params.gender], function (val) {
      return utils.splitHandle({
        cutOffLowest: 1,
        join: function (ten, single) {
          return Particles(single, tenUnd, Particles(ten, tenZig));
        },
        handleParts: function (val) { return _inWords(val, params); }
      }, val);
    }, val);
  };
}());

var medium = function (joiner, pos) {
  joiner = P(joiner).asSuffix();
  return function (val, params) {
    return utils.splitHandle({
      cutOffLowest: pos,
      join: function (higher, lower) {
        return Particles(higher, joiner, lower);
      },
      handleHigherPart: function (val) {
        return _inWords(val, {});
      },
      handleLowerPart: function (val) {
        return _inWords(val, params);
      }
    }, val);
  };
};

var biggie = function (nounP, cutOff) {
  var biggieSpace = P(' ').asPrefix();
  nounP = nounP.asSuffix();
  return function (val, params) {
    return utils.splitHandle({
      cutOffLowest: cutOff,
      join: function (higher, lower) {
        higher = String(higher);
        var res = [];
        // The big nouns need to know if they come after 'eine', so we split it off
        if (higher.substr(-4) === 'eine') {
          res = res.concat([ higher.substr(0, higher.length - 4), 'eine' ]);
        } else {
          res.push(higher);
        }
        res = res.concat([ nounP, biggieSpace, lower ]);
        return Particles(res);
      },
      handleHigherPart: function (val) {
        return _inWords(val, {gender: 'f'});
      },
      handleLowerPart: function (val) {
        return _inWords(val, params);
      }
    }, val);
  };
};

// FIXME: Bigger numbers
var handlers = (function () {
  var h = [
    {d: 2, h: lessThanHundred},
    {d: 3, h: medium.bind(null, 'hundert')},
    {d: 6, h: medium.bind(null, 'tausend')},
    {d: 9, h: biggie.bind(null, P(' Millionen').looses('after', 'eine', 2))},
    {d: 12, h: biggie.bind(null, P(' Milliarden').looses('after', 'eine', 1))},
    {d: 15, h: biggie.bind(null, P(' Billionen').looses('after', 'eine', 2))},
    {d: 18, h: biggie.bind(null, P(' Billiarden').looses('after', 'eine', 1))},
    {d: 21, h: biggie.bind(null, P(' Trillionen').looses('after', 'eine', 2))},
    {d: 24, h: biggie.bind(null, P(' Trilliarden').looses('after', 'eine', 1))},
    {d: 27, h: biggie.bind(null, P(' Quadrillionen').looses('after', 'eine', 2))},
    {d: 30, h: biggie.bind(null, P(' Quadrilliarden').looses('after', 'eine', 1))},
  ];
  var handlers = {
    max: h[h.length - 1].d
  };
  for (var i = 0; i < h.length; ++i) {
    handlers[h[i].d] = i > 0 ? h[i].h(h[i-1].d) : h[i].h;
  }
  return handlers;
}());

function _inWords(val, params) {
  params.gender = params.gender || 'm';
  return utils.firstPropFrom(handlers, val.length)(val, params);
}

function inWords(val, params) {
  val = String(val);
  if (val.length > inWords.max) {
    throw new Error('too big');
  }
  return String(_inWords(val, params || {}));
}
inWords.max = handlers.max;

module.exports = inWords;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

var particles = __webpack_require__(0);
var P = particles.Particle;
var Particles = particles.Particles;
var Words = particles.Words;

var lessThanHundred = (function () {
  var atoms = {
     0: P('zero').hides('after', '*').hides('before', '*'),
     1: P('one').mutates('before', 'ty', 'te'),
     2: P('two').mutates('before', 'ty', 'twen'),
     3: P('three').mutates('before', 'teen', 'thir').mutates('before', 'ty', 'thir'),
     4: P('four').mutates('before', 'ty', 'for'),
     5: P('five').mutates('before', 'teen', 'fif').mutates('before', 'ty', 'fif'),
     6: 'six',
     7: 'seven',
     8: P('eight').mutates('before', 'teen', 'eigh').mutates('before', 'ty', 'eigh'),
     9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve'
  };

  var tenDash = P('-').asJoiner();
  var tenTy = P('ty').asSuffix().mutates('after', 'one', 'en');

  var buildLessThanHundred = function (v) {
    var lt21 = v < 21;
    return utils.splitHandle({
      cutOffLowest: 1,
      join: function (ten, single) {
        var tenPs = Particles(ten, tenTy);
        return lt21 ? Particles(single, tenPs) : Particles(tenPs, tenDash, single);
      },
      handleParts: _inWords
    }, v);
  };
  return utils.withOverrides.bind(null, atoms, buildLessThanHundred);
}());

// FIXME: Bigger numbers
var handlers = (function () {
  var h = [
    {d: 2, h: lessThanHundred},
    {d: 3, h: 'hundred'},
    {d: 6, h: 'thousand'},
    {d: 9, h: 'million'}
  ];
  var handlers = {
    max: h[h.length - 1].d
  };
  function join (joiner, higher, lower) {
    return Words(higher, joiner, lower);
  }
  for (var i = 0; i < h.length; ++i) {
    if (typeof h[i].h !== 'function') {
      h[i].h = utils.splitHandle.bind(utils, {
        cutOffLowest: h[i-1].d,
        join: join.bind(null, P(h[i].h).asSuffix()),
        handleParts: _inWords
      });
    }
    handlers[h[i].d] = h[i].h;
  }
  return handlers;
}());

function _inWords(val) {
  return utils.firstPropFrom(handlers, val.length)(val);
}

function inWords(val) {
  val = String(val);
  if (val.length > inWords.max) {
    throw new Error('too big');
  }
  return String(_inWords(val));
}
inWords.max = handlers.max;

module.exports = inWords;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Based on  https://github.com/exu/slownie.js
 */



var utils = __webpack_require__(1);

var particles = __webpack_require__(0);
var P = particles.Particle;
var Particles = particles.Particles;

var joinSpace = P(' ').asJoiner();

var lessThanHundred = (function () {
  var atoms = {
     0: P('zero').hides('after', '*').hides('before', '*'),
     1: P('jeden').mutates('before', 'dziesiąt', 'na') // FIXME joining thing
      .mutates('before', 'naście', 'jede'),
     2: P('dwa').mutates('before', 'set', 'dwie'),
     3: 'trzy',
     4: P('cztery').mutates('before', 'naście', 'czter')
      .mutates('before', 'dziesiąt', 'czter'),
     5: P('pięć').mutates('before', 'naście', 'pięt'),
     6: P('sześć').mutates('before', 'naście', 'szes'),
     7: 'siedem',
     8: 'osiem',
     9: P('dziewięć').mutates('before', 'dziesiąt', 'dziewiec')
      .mutates('before', 'set', 'dziewięc')
      .mutates('before', 'naście', 'dziewięt'),
    10: 'dziesięc'
  };

  var tenDziesiat = P('dziesiąt').asSuffix()
    .mutates('after', 'jeden', 'ście')
    .mutates('after', 'dwa', 'dzieścia')
    .mutates('after', 'trzy', 'dzieści')
    .mutates('after', 'cztery', 'dzieści');

  var buildLessThanHundred = function (v) {
    return utils.splitHandle({
      cutOffLowest: 1,
      join: function (ten, single) {
        var tenPs = Particles(ten, tenDziesiat);
        return Particles(v < 20 ? [single, tenPs] : [tenPs, joinSpace, single]);
      },
      handleParts: _inWords
    }, v);
  };
  return utils.withOverrides.bind(null, atoms, buildLessThanHundred);
}());

var createBiggie = (function () {
  var JEDEN_SOLO = 'JEDENSOLO';

  return function (pos, opts) {
    var joiner;

    if (typeof opts === 'string') {
      opts = {
        jeden: opts,
        other: ' ' + opts + 'ów',

        'dwa': ' ' + opts + 'y',
        'trzy': ' ' + opts + 'y',
        'cztery': ' ' + opts + 'y'
      };
    }

    joiner = P(opts.other).mutates('after', JEDEN_SOLO, opts.jeden);
    joiner = [ 'dwa', 'trzy', 'cztery' ].reduce(function (p, otherP) {
      return p.mutates('after', otherP, opts[otherP]);
    }, joiner);

    return function (val) {
      return utils.splitHandle({
        cutOffLowest: pos,
        join: function (higher, lower) {
          // jeden is left out if it is the only number before the biggie
          if (String(higher).match(/^\s*jeden\s*$/)) {
            return Particles(joiner.toString(' ', JEDEN_SOLO), joinSpace, lower);
          }

          // This has been really difficult because 1000 (tysięcy) needs to react
          // on the previous particle but also has to check on the total
          // higher particles, since it is a suffix.

          // FIXME: Will fail pretty soon on JS’ Unicode RegExp issues wrt \b
          if (higher instanceof Particles) {
            higher = String(higher).split(/\b/);
          } else {
            higher = [ higher ];
          }
          return Particles(higher.concat([joiner.asSuffix(), joinSpace, lower]));
        },
        handleParts: _inWords
      }, val);
    };
  };
}());

var handlers = (function () {
  var h = [
    {d: 2, h: lessThanHundred},
    {d: 3, h: {
      jeden: 'sto',
      other: 'set',

      'dwa': 'ście',
      'trzy': 'sta',
      'cztery': 'sta'
    }},
    {d: 6, h: {
      jeden: 'tysiąc',
      other: ' tysięcy',

      'dwa': ' tysiące',
      'trzy': ' tysiące',
      'cztery': ' tysiące'
    }},
  ];
  var n = 6;
  [ 'milion', 'miliard', 'bilion', 'biliard', 'trylion', 'tryliard',
    'kwadrylion' ].forEach(function (p) {
    h.push({d: n+=3, h: p});
  });
  var handlers = {
    max: h[h.length - 1].d
  };
  for (var i = 0; i < h.length; ++i) {
    if (typeof h[i].h !== 'function') {
       h[i].h = createBiggie(h[i-1].d, h[i].h);
    }
    handlers[h[i].d] = h[i].h;
  }
  return handlers;
}());

function _inWords(val) {
  return utils.firstPropFrom(handlers, val.length)(val);
}

function inWords(val) {
  val = String(val);
  if (val.length > inWords.max) {
    throw new Error('too big');
  }
  // FIXME: Should not be here
  return String(_inWords(val)).replace(/^\s+/, '').replace(/ {2}/g, ' ');
}
inWords.max = handlers.max;

module.exports = inWords;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

// copied from http://freenet.msp.mn.us/people/calguire/morse.html
module.exports = {
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',
  'Á': '.--.-', // A with acute accent
  'Ä': '.-.-',  // A with diaeresis
  'É': '..-..', // E with acute accent
  'Ñ': '--.--', // N with tilde
  'Ö': '---.',  // O with diaeresis
  'Ü': '..--',  // U with diaeresis
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '0': '-----',
  ',': '--..--',  // comma
  '.': '.-.-.-',  // period
  '?': '..--..',  // question mark
  ';': '-.-.-',   // semicolon
  ':': '---...',  // colon
  '/': '-..-.',   // slash
  '-': '-....-',  // dash
  "'": '.----.',  // apostrophe
  '()': '-.--.-', // parenthesis
  '_': '..--.-',  // underline
  '@': '.--.-.',  // at symbol from http://www.learnmorsecode.com/
  ' ': '.......'
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  encode: encode,
  decode: decode,
  map: map,
  tree: tree
};

var map = __webpack_require__(13);
var tree = __webpack_require__(15);

function encode (obj) {
  return maybeRecurse(obj, encodeMorseString);

  function encodeMorseString (str) {
    var ret = str.split('');
    for (var j in ret) {
      ret[j] = map[ret[j].toUpperCase()] || '?';
    }
    return ret.join(' ');
  }
}

function decode (obj, dichotomic) {
  return maybeRecurse(obj, decodeMorseString);

  function decodeMorseString (str) {
    var ret = str.split(' ');
    for (var i in ret) {
      if (!dichotomic) {
        ret[i] = decodeCharacterByMap(ret[i]);
      } else {
        ret[i] = decodeCharacterByDichotomy(ret[i]);
      }
    }
    return ret.join('');
  }
}

function maybeRecurse (obj, func) {
  if (!obj.pop) {
    return func(obj);
  }

  var clone = [];
  var i = 0;
  for (; i < obj.length; i++) {
    clone[i] = func(obj[i]);
  }
  return clone;
}

function decodeCharacterByMap (char) {
  for (var i in map) {
    if (map[i] == char) {
      return i;
    }
  }
  return ' ';
}

function decodeCharacterByDichotomy (char) {
  var sub = char.split('');
  return traverseNodeWithCharacters(tree, sub);

  function traverseNodeWithCharacters (node, chars) {
    var cur = chars.shift();
    if (!node[cur]) {
      return node.stop || '?';
    }
    return traverseNodeWithCharacters(node[cur], chars);
  }
}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

// might be the dumbest idea I've ever had
module.exports = {
  '.': {
    stop: 'E',
    '.': {
      stop: 'I',
      '.': {
        stop: 'S',
        '.': {
          stop: 'H',
          '.': {
            stop: '5'
          },
          '-': {
            stop: '4'
          }
        },
        '-': {
          stop: 'V',
          '.': {
            stop: 'Ś'
          },
          '-': {
            stop: '3'
          }
        }
      },
      '-': {
        stop: 'U',
        '.': {
          stop: 'F',
          // note lack of -
          '.': {
            stop: 'É'
          }
        },
        '_': {
          stop: 'Ü',
          '.': {
            stop: 'Ð',
            '.': {
              stop: '?'
            },
            '-': {
              stop: '_'
            }
          },
          '-': {
            stop: '2'
          }
        }
      }
    },
    '-': {
      stop: 'A',
      '.': {
        stop: 'R',
        '.': {
          stop: 'L',
          // note lack of .
          '-': {
            stop: 'È',
            '.': {
              stop: '"'
            }
          }
        },
        '-': {
          stop: 'Ä',
          // note lack of -
          '.': {
            stop: '+',
            // note lack of .
            '-': {
              stop: '.'
            }
          }
        }
      },
      '-': {
        stop: 'W',
        '.': {
          stop: 'P',
          // '.': {},
          // TODO can't replicate character -_-
          '-': {
            stop: 'À',
            // note lack of -
            '.': {
              stop: '@'
            }
          }
        },
        '-': {
          stop: 'J',
          '.': {
            stop: 'Ĵ'
          },
          '-': {
            stop: '1',
            // note lack of -
            '.': {
              stop: "'"
            }
          }
        }
      }
    }
  },
  '-': {
    stop: 'T',
    '.': {
      stop: 'N',
      '.': {
        stop: 'D',
        '.': {
          stop: 'B',
          '.': {
            stop: '6',
            // notive lack of .
            '-': {
              stop: '-'
            }
          },
          '-': {
            stop: '='
          }
        },
        '-': {
          stop: 'X',
          // notice lack of -
          '.': {
            stop: '/'
          }
        }
      },
      '-': {
        stop: 'K',
        '.': {
          stop: 'C',
          '.': {
            stop: 'Ç'
          },
          '-': {
            // notice lack of stop
            '.': {
              stop: ';'
            },
            '-': {
              stop: '!'
            }
          }
        },
        '-': {
          stop: 'Y',
          // notice lack of -
          '.': {
            stop: 'Ĥ',
            // notice lack of .
            '-': {
              stop: '()'
            }
          }
        }
      }
    },
    '-': {
      stop: 'M',
      '.': {
        stop: 'G',
        '.': {
          stop: 'Z',
          '.': {
            stop: '7'
          },
          '-': {
            // note lack of stop
            // note lack of .
            '-': {
              stop: ','
            }
          }
        },
        '-': {
          stop: 'Q',
          '.': {
            stop: 'Ĝ'
          },
          '-': {
            stop: 'Ñ'
          }
        }
      },
      '-': {
        stop: 'O',
        '.': {
          stop: 'Ö',
          // note lack of -
          '.': {
            stop: '8',
            // note lack of -
            '.': {
              stop: ':'
            }
          }
        },
        '-': {
          stop: 'CH', // is there a digraph for this?
          '.': {
            stop: '9'
          },
          '-': {
            stop: '0'
          }
        }
      }
    }
  }
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

function myanmarNumbers(str, toLanguage) {
  str += "";
  toLanguage = (toLanguage || "en").toLowerCase();

  var replaceNumbers = function(txt) {
    var numbers = {
      // Myanmar and Shan numbers
      "๐": 0,
      "၀": 0,
      "ဝ": 0,
      "၁": 1,
      "၂": 2,
      "၃": 3,
      "၄": 4,
      "၅": 5,
      "၆": 6,
      "၇": 7,
      "၈": 8,
      "၉": 9,
      "႐": 0,
      "႑": 1,
      "႒": 2,
      "႓": 3,
      "႔": 4,
      "႕": 5,
      "႖": 6,
      "႗": 7,
      "႘": 8,
      "႙": 9
    };

    var keys = Object.keys(numbers);
    if (toLanguage === "my") {
      // Myanmar
      for (var n = 2; n <= 11; n++) {
        var re = new RegExp(numbers[keys[n]] + "", "g");
        txt = txt.replace(re, keys[n]);
      }
    } else if (toLanguage === "shan") {
      // Shan numerals - convert any Myanmar numbers to international first
      var txt = myanmarNumbers(txt) + "";
      for (var n = 12; n < keys.length; n++) {
        var re = new RegExp(numbers[keys[n]] + "", "g");
        txt = txt.replace(re, keys[n]);
      }
    } else {
      for (var n = 0; n < keys.length; n++) {
        // default
        var re = new RegExp(keys[n], "g");
        txt = txt.replace(re, numbers[keys[n]]);
      }
    }
    return txt;
  };

  var getDateDivider = function(txt) {
    var dividers = [".","/","-"];
    for (var r = 0; r < dividers.length; r++) {
      var test = txt.split(dividers[r]);
      if (test.length === 3) {
        var day = test[0] * 1;
        var month = test[1] * 1;
        var year = test[2] * 1;
        if (day && month && year && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
          if (day < 32 && month < 13 && year < 4000) {
            return dividers[r];
          }
        }
      }
    }
  };

  var numerals = replaceNumbers(str);
  if (isNaN(1 * numerals)) {
    // check for Date parsing
    if ((toLanguage === "my" || toLanguage === "shan") && isNaN(1 * str)) {
      try {
        var d = new Date(str);
        if (isNaN(d * 1)) {
          throw 'invalid date';
        }
        // valid date - output numbers in this order and send for conversion
        return replaceNumbers([d.getDate(), d.getMonth() + 1, d.getFullYear()].join("."));
      } catch(e) {
        // not a valid Date or a number - return formatted string
        return numerals;
      }
    } else {
      var dateDivider = getDateDivider(numerals);
      if (dateDivider) {
        var split = numerals.split(dateDivider);
        var rearranged = [split[1], split[0], split[2]].join(dateDivider);
        try {
          var d = new Date(rearranged);
          // valid date
          return d;
        } catch (e) {
          // not a valid Date or a number - return formatted String
          return numerals;
        }
      } else {
        // not a Date or a Number - return formatted String
        return numerals;
      }
    }
  } else {
    // return a Number
    return 1 * numerals;
  }
}

if (true) {
  module.exports = myanmarNumbers;
}


/***/ }),
/* 17 */
/***/ (function(module, exports) {


var Roman = function () {

};

Roman.romanToDecimal = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
};

Roman.prototype.toDecimal = function (roman, checkIsValid) {
    if (typeof roman !== 'string') {
        throw new Error('Roman numerals must be a string');
    }
    roman = roman.trim();

    var value = 0;

    for (var i = 0; i < roman.length; i++) {
        var ch = Roman.romanToDecimal[ roman[i] ];

        if (!ch) {
            throw new Error('Unknown roman numeral: ' + roman[i] + ' at position ' + (i + 1));
        }

        if (roman[i + 1] === '̅') {
            ch *= 1000;
            i++;
        }

        var next = Roman.romanToDecimal[ roman[i + 1] ];

        if (roman[i + 2] === '̅') {
            next *= 1000;
        }

        if (!next || ch >= next) {
            value += ch;
        } else {
            value -= ch;
        }
    }

    if (checkIsValid) {
        var validRoman = this.toRoman(value);
        if (validRoman !== roman) {
            throw new Error(roman + ' is not valid Roman Numerals. Should be ' + validRoman);
        }
    }

    return value;
};

Roman.decimalToRoman = [
    { v: 1000000, r: 'M̅' },
    { v: 900000, r: 'X̅M̅' },
    { v: 500000, r: 'D̅' },
    { v: 400000, r: 'C̅D̅' },
    { v: 100000, r: 'C̅' },
    { v: 90000, r: 'X̅C̅' },
    { v: 50000, r: 'L̅' },
    { v: 40000, r: 'X̅L̅' },
    { v: 10000, r: 'X̅' },
    { v: 9000, r: 'I̅X̅' },
    { v: 5000, r: 'V̅' },
    { v: 4000, r: 'I̅V̅' },
    { v: 1000, r: 'M' },
    { v: 900, r: 'CM' },
    { v: 500, r: 'D' },
    { v: 400, r: 'CD' },
    { v: 100, r: 'C' },
    { v: 90, r: 'XC' },
    { v: 50, r: 'L' },
    { v: 40, r: 'XL' },
    { v: 10, r: 'X' },
    { v: 9, r: 'IX' },
    { v: 5, r: 'V' },
    { v: 4, r: 'IV' },
    { v: 1, r: 'I' }
];

Roman.prototype.toRoman = function (value) {
    value = parseInt(value, 10);
    if (value <= 0) return '';

    var roman = '';

    Roman.decimalToRoman.forEach(function (numeral) {
        while (value >= numeral.v) {
            roman += numeral.r;
            value -= numeral.v;
        }
    });

    return roman;
};

module.exports = new Roman();


/***/ }),
/* 18 */
/***/ (function(module, exports) {

function toBinary(n) {
  return zeroFill(convertToBinary(n))
}

function convertToBinary(n) {
	if(n <= 1) {
		return String(n)
	} else {
		return convertToBinary(Math.floor(n/2)) + String(n%2)
	}
}

function zeroFill(value) {
  var length = value.length
  while(length < 8) {
    value = '0' + value
    length++
  }
  return value
}

module.exports = toBinary

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
* PersianJs v0.3.0
* https://github.com/usablica/persian.js
* MIT licensed
*
* Copyright (C) 2012 usabli.ca and other contributors
*/
(function () {

    //Default config/variables
    var VERSION = "0.3.0",
        //Check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);

    /**
    * PersianJs main class
    *
    * @class PersianJs
    */
    function PersianJs(str) {
        this._str = str;
    }

    /**
    * Used for convert Arabic characters to Persian
    *
    * @api private
    * @method _arabicChar
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _arabicChar(value) {
        if (!value) {
            return;
        }
        var arabicChars = ["ي", "ك", "‍", "دِ", "بِ", "زِ", "ذِ", "ِشِ", "ِسِ", "‌", "ى"],
            persianChars = ["ی", "ک", "", "د", "ب", "ز", "ذ", "ش", "س", "", "ی"];

        for (var i = 0, charsLen = arabicChars.length; i < charsLen; i++) {
            value = value.replace(new RegExp(arabicChars[i], "g"), persianChars[i]);
        }
        this._str = value;
        return this;
    }

    /**
    * Used for Change keyboard layout
    *
    * @api private
    * @method _switchKey
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _switchKey(value) {
        if (!value) {
            return;
        }
        var persianChar = [ "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "پ", "و","؟" ],
            englishChar = [ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",","?" ];

        for (var i = 0, charsLen = persianChar.length; i < charsLen; i++) {
            value = value.replace(new RegExp(persianChar[i], "g"), englishChar[i]);
        }
        this._str = value;
        return this;
    }

    /**
    * Used for convert Arabic numbers to Persian
    *
    * @api private
    * @method _arabicNumber
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _arabicNumber(value) {
        if (!value) {
            return;
        }
        var arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"],
            persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];

        for (var i = 0, numbersLen = arabicNumbers.length; i < numbersLen; i++) {
            value = value.replace(new RegExp(arabicNumbers[i], "g"), persianNumbers[i]);
        }
        this._str = value;
        return this;
    }

    /**
    * Used for convert English numbers to Persian
    *
    * @api private
    * @method _englishNumber
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _englishNumber(value) {
        if (!value) {
            return;
        }
        var englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];

        for (var i = 0, numbersLen = englishNumbers.length; i < numbersLen; i++) {
            value = value.replace(new RegExp(englishNumbers[i], "g"), persianNumbers[i]);
        }
        this._str = value;
        return this;
    }

    /**
    * Used for fix Persian Charachters in URL
    * https://fa.wikipedia.org/wiki/مدیاویکی:Gadget-Extra-Editbuttons-Functions.js
    *
    * @api private
    * @method _fixURL
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _fixURL(value) {
        if (!value) {
            return;
        }
        // Replace every %20 with _ to protect them from decodeURI
        var old = "";
        while (old != value) {
            old = value;
            value = value.replace(/(http\S+?)\%20/g, '$1\u200c\u200c\u200c_\u200c\u200c\u200c');
        }
        // Decode URIs
        // NOTE: This would convert all %20's to _'s which could break some links
        // but we will undo that later on
        value = value.replace(/(http\S+)/g, function (s, p) {
            return decodeURI(p);
        });
        // Revive all instances of %20 to make sure no links is broken
        value = value.replace(/\u200c\u200c\u200c_\u200c\u200c\u200c/g, '%20');
        this._str = value;
        return this;
    }

    var persianJs = function(inputStr) {
        if (!inputStr || inputStr === "") {
            throw new Error("Input is null or empty.");
        }
        return new PersianJs(inputStr);
    };
    
    /**
    * Current PersianJs version
    *
    * @property version 
    * @type String
    */
    persianJs.version = VERSION;

    //Prototype
    persianJs.fn = PersianJs.prototype = {
        clone: function () {
            return persianJs(this);
        },
        value: function () {
            return this._str;
        },
        toString: function () {
            return this._str.toString();
        },
        set : function (value) {
            this._str = String(value);
            return this;
        },
        arabicChar: function() {
            return _arabicChar.call(this, this._str);
        },
        arabicNumber: function() {
            return _arabicNumber.call(this, this._str);
        },
        fixURL: function() {
            return _fixURL.call(this, this._str);
        },
        englishNumber: function() {
            return _englishNumber.call(this, this._str);
        },
        switchKey: function() {
            return _switchKey.call(this, this._str);
        }
    };

    //Expose PersianJs
    //CommonJS module is defined
    if (hasModule) {
        module.exports = persianJs;
    }
    //global ender:false
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `persianJs` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        this['persianJs'] = persianJs;
    }
    //global define:false
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return persianJs;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
})();


/***/ })
/******/ ]);