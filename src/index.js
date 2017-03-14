Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const react_router_1 = require("react-router");
const routes_1 = require("./routes");
require("./index.css");
require("react-grid-layout/css/styles.css");
require("react-resizable/css/styles.css");
const injectTapEventPlugin = require("react-tap-event-plugin");
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
ReactDOM.render(<react_router_1.Router history={react_router_1.browserHistory}>
    {routes_1.default}
  </react_router_1.Router>, document.getElementById('app'));
