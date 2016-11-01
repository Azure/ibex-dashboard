'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsCreateFragment = require('react-addons-create-fragment');

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _translate = require('./translate');

var _translate2 = _interopRequireDefault(_translate);

var ReactListView = (function (_React$Component) {
  _inherits(ReactListView, _React$Component);

  _createClass(ReactListView, null, [{
    key: 'propTypes',
    value: {
      className: _react.PropTypes.string,
      style: _react.PropTypes.object,

      renderItem: _react.PropTypes.func.isRequired,

      rowCount: _react.PropTypes.number,
      columnCount: _react.PropTypes.number,
      rowHeight: _react.PropTypes.number,
      columnWidth: _react.PropTypes.number,

      // Controllables
      clientHeight: _react.PropTypes.number,
      clientWidth: _react.PropTypes.number,
      scrollTop: _react.PropTypes.number,
      scrollLeft: _react.PropTypes.number
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      className: null,
      style: {},

      rowCount: 1,
      columnCount: 1,
      rowHeight: 0,
      columnWidth: 0,

      clientHeight: -1,
      clientWidth: -1,
      scrollTop: -1,
      scrollLeft: -1
    },
    enumerable: true
  }]);

  function ReactListView(props, context) {
    _classCallCheck(this, ReactListView);

    _get(Object.getPrototypeOf(ReactListView.prototype), 'constructor', this).call(this, props, context);

    this._isControlled = props.clientHeight !== -1 || props.clientWidth !== -1;
    if (!this._isControlled) {
      this.state = {
        clientHeight: -1,
        clientWidth: -1,
        scrollTop: -1,
        scrollLeft: -1
      };
    }

    this._handleScroll = this._handleScroll.bind(this);
  }

  _createClass(ReactListView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this._isControlled) {
        var _ReactDOM$findDOMNode = _reactDom2['default'].findDOMNode(this);

        var clientHeight = _ReactDOM$findDOMNode.clientHeight;
        var clientWidth = _ReactDOM$findDOMNode.clientWidth;
        var scrollTop = _ReactDOM$findDOMNode.scrollTop;
        var scrollLeft = _ReactDOM$findDOMNode.scrollLeft;

        this.setState({ clientHeight: clientHeight, clientWidth: clientWidth, scrollTop: scrollTop, scrollLeft: scrollLeft });
      }
    }
  }, {
    key: '_handleScroll',
    value: function _handleScroll(e) {
      this.setState({
        scrollTop: e.target.scrollTop,
        scrollLeft: e.target.scrollLeft
      });
    }
  }, {
    key: '_getBoundaries',
    value: function _getBoundaries(scroll, itemDimension, clientDimension, maxDimension) {
      var min = Math.floor(scroll / itemDimension);
      var max = Math.min(maxDimension, min + Math.ceil(clientDimension / itemDimension));
      return [min, max];
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var style = _props.style;
      var className = _props.className;
      var renderItem = _props.renderItem;
      var rowCount = _props.rowCount;
      var columnCount = _props.columnCount;
      var rowHeight = _props.rowHeight;
      var columnWidth = _props.columnWidth;

      var _ref = this._isControlled ? this.props : this.state;

      var scrollTop = _ref.scrollTop;
      var scrollLeft = _ref.scrollLeft;
      var clientHeight = _ref.clientHeight;
      var clientWidth = _ref.clientWidth;

      var minY = undefined,
          maxY = undefined;
      if (clientHeight === -1) {
        minX = 0;
        maxX = -1;
      } else if (rowHeight > 0) {
        var _getBoundaries2 = this._getBoundaries(scrollTop, rowHeight, clientHeight, rowCount - 1);

        var _getBoundaries22 = _slicedToArray(_getBoundaries2, 2);

        minY = _getBoundaries22[0];
        maxY = _getBoundaries22[1];
      } else {
        minY = 0;
        maxY = 0;
      }

      var minX = undefined,
          maxX = undefined;
      if (clientWidth === -1) {
        minX = 0;
        maxX = -1;
      } else if (columnWidth > 0) {
        var _getBoundaries3 = this._getBoundaries(scrollLeft, columnWidth, clientWidth, columnCount - 1);

        var _getBoundaries32 = _slicedToArray(_getBoundaries3, 2);

        minX = _getBoundaries32[0];
        maxX = _getBoundaries32[1];
      } else {
        minX = 0;
        maxX = 0;
      }

      var items = {};
      for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
          items[x + ',' + y] = renderItem(x, y, (0, _translate2['default'])(x * columnWidth, y * rowHeight, true));
        }
      }

      var listViewClassName = 'ReactListView';
      if (className) {
        listViewClassName += ' ' + className;
      }

      return _react2['default'].createElement(
        'div',
        {
          className: listViewClassName,
          style: _extends({
            position: 'relative',
            overflow: 'auto'
          }, this._isControlled ? {} : (0, _translate2['default'])(0, 0, 0), style),
          onScroll: !this._isControlled && this._handleScroll
        },
        _react2['default'].createElement(
          'div',
          {
            className: 'ReactListView-container',
            style: {
              overflow: 'hidden',
              height: rowHeight !== 0 ? rowHeight * rowCount + 'px' : '100%',
              width: columnWidth !== 0 ? columnWidth * columnCount + 'px' : 'auto'
            }
          },
          (0, _reactAddonsCreateFragment2['default'])(items)
        )
      );
    }
  }]);

  return ReactListView;
})(_react2['default'].Component);

exports['default'] = ReactListView;
module.exports = exports['default'];
// As per the CSS3 2D transform spec, transformed elements act as a
// containing block for fixed positioned descendants.
// Do not create a containing block if the component isn't controlled:
// the user should define their own containing block.
// See https://github.com/Morhaus/react-list-view/issues/2