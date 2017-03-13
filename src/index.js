Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var react_router_1 = require("react-router");
var routes_1 = require("./routes");
require("./index.css");
require("react-grid-layout/css/styles.css");
require("react-resizable/css/styles.css");
var injectTapEventPlugin = require("react-tap-event-plugin");
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
ReactDOM.render(<react_router_1.Router history={react_router_1.browserHistory}>
    {routes_1.default}
  </react_router_1.Router>, document.getElementById('app'));
