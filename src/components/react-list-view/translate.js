// Extracted from emberjs/list-view

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = translate;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _document$createElement = document.createElement('div');

var style = _document$createElement.style;

var propPrefixes = ['Webkit', 'Moz', 'O', 'ms'];

function testProp(prop) {
  if (prop in style) {
    return prop;
  }

  var capitalizedProp = prop.charAt(0).toUpperCase() + prop.slice(1);

  var prefixedProp = undefined;
  for (var i = 0; i < propPrefixes.length; i++) {
    prefixedProp = propPrefixes[i] + capitalizedProp;
    if (prefixedProp in style) {
      return prefixedProp;
    }
  }
  return false;
}

var transformProp = testProp('transform');
var perspectiveProp = testProp('perspective');

var supports2D = !!transformProp;
var supports3D = !!perspectiveProp;

function translate(x, y) {
  var addPosition = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (supports3D) {
    var _ref;

    return _ref = {}, _defineProperty(_ref, transformProp, 'translate3d(' + x + 'px, ' + y + 'px, 0)'), _defineProperty(_ref, 'position', addPosition ? 'fixed' : null), _ref;
  }
  if (supports2D) {
    var _ref2;

    return _ref2 = {}, _defineProperty(_ref2, transformProp, 'translate(' + x + 'px, ' + y + 'px)'), _defineProperty(_ref2, 'position', addPosition ? 'fixed' : null), _ref2;
  }
  return {
    top: y + 'px',
    left: x + 'px',
    position: addPosition ? 'absolute' : null
  };
}

module.exports = exports['default'];