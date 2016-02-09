import {Actions} from './actions/Actions';
import React, { PropTypes, Component } from 'react';
import {default as ReactDOM, findDOMNode} from "react-dom";
import {default as Router, Route } from 'react-router'
import {routes} from './routes/routes';
import createHistory from 'history/lib/createHashHistory';
import logging from './logging/appInsight';
import {SERVICES} from './services/services';

let userProfile = (window.location.host.indexOf('localhost:')==-1)?SERVICES.getUserAuthenticationInfo():Actions.constants.DEFAULTS.USER_PROFILE;
let history = createHistory({
  queryKey: false
});

const createElement = (Component, props) => {
    return <Component {...props} />
};

ReactDOM.render((<Router history={history}
                         createElement={createElement}>
                         {routes}
                 </Router>), document.getElementById('app'));
