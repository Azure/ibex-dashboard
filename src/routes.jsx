Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var App_1 = require("./components/App");
//import Dashboard from './components/Dashboard';
var generic_1 = require("./components/generic");
var NotFound_1 = require("./pages/NotFound");
var About_1 = require("./pages/About");
var Dashboard_1 = require("./pages/Dashboard");
exports.default = (<react_router_1.Route component={App_1.default}>
    <react_router_1.Route path="/" component={Dashboard_1.default}/>
    <react_router_1.Route path="/generic" component={generic_1.default}/>
    <react_router_1.Route path="/about" component={About_1.default}/>
    <react_router_1.Route path="/dashboard" component={Dashboard_1.default}/>
    <react_router_1.Route path="*" component={NotFound_1.default}/>
  </react_router_1.Route>);
