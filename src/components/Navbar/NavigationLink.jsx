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
const React = require("react");
const react_router_1 = require("react-router");
class NavigationLink extends React.PureComponent {
    // NOTE: Don't try using Stateless (function) component here. `ref` is
    // required by React-MD/AccessibleFakeButton, but Stateless components
    // don't have one by design:
    // https://github.com/facebook/react/issues/4936
    render() {
        const _a = this.props, { href, as, children } = _a, _props = __rest(_a, ["href", "as", "children"]);
        return (<div {..._props} style={{ padding: 0 }}>
        <react_router_1.Link href={href} as={as}>
          <a className='md-list-tile md-list-tile--mini' style={{ width: '100%', overflow: 'hidden' }}>
            {children}
          </a>
        </react_router_1.Link>
      </div>);
    }
}
exports.default = NavigationLink;
