Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_1 = require("react-router");
const App_1 = require("./components/App");
//import Dashboard from './components/Dashboard';
const generic_1 = require("./components/generic");
const NotFound_1 = require("./pages/NotFound");
const About_1 = require("./pages/About");
const Dashboard_1 = require("./pages/Dashboard");
exports.default = (<react_router_1.Route component={App_1.default}>
    <react_router_1.Route path="/" component={Dashboard_1.default}/>
    <react_router_1.Route path="/generic" component={generic_1.default}/>
    <react_router_1.Route path="/about" component={About_1.default}/>
    <react_router_1.Route path="/dashboard" component={Dashboard_1.default}/>
    <react_router_1.Route path="*" component={NotFound_1.default}/>
  </react_router_1.Route>);
