var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var NavigationLink = (function (_super) {
    __extends(NavigationLink, _super);
    function NavigationLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // NOTE: Don't try using Stateless (function) component here. `ref` is
    // required by React-MD/AccessibleFakeButton, but Stateless components
    // don't have one by design:
    // https://github.com/facebook/react/issues/4936
    NavigationLink.prototype.render = function () {
        var _a = this.props, href = _a.href, as = _a.as, children = _a.children, _props = __rest(_a, ["href", "as", "children"]);
        return (<div {..._props} style={{ padding: 0 }}>
        <react_router_1.Link href={href} as={as}>
          <a className='md-list-tile md-list-tile--mini' style={{ width: '100%', overflow: 'hidden' }}>
            {children}
          </a>
        </react_router_1.Link>
      </div>);
    };
    return NavigationLink;
}(React.PureComponent));
exports.default = NavigationLink;
