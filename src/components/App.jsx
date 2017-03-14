Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Navbar_1 = require("./Navbar");
class App extends React.Component {
    render() {
        var { children } = this.props;
        return (
        // <Navbar history={this.props.history}>
        <Navbar_1.default history={this.props.history}>
        {children}
      </Navbar_1.default>);
    }
}
exports.default = App;
