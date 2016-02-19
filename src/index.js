import {DataStore} from './stores/DataStore';
import {Actions} from './actions/Actions';
import Fluxxor from 'fluxxor';
import {SERVICES} from './services/services';
import React, { PropTypes, Component } from 'react';
import {default as ReactDOM, findDOMNode} from "react-dom";
import {default as Router, Route } from 'react-router'
import {routes} from './routes/routes';
import createHistory from 'history/lib/createHashHistory';
import logging from './logging/appInsight';

//FIXME: This should be set from Azure config. Need to sync the process.env
//down to a json file from azure on node startup, as the process env is not available for client
//side scripts
window.process = window.process || {};
window.process.env = window.process.env || {};
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let userProfile = (window.location.host.indexOf('localhost:')==-1)?SERVICES.getUserAuthenticationInfo():Actions.constants.USER_PROFILE;
let history = createHistory({
  queryKey: false
});

let stores = {
  DataStore: new DataStore(userProfile)
};

let flux = new Fluxxor.Flux(stores, Actions.methods);

const createElement = (Component, props) => {
    props.flux = flux;
    return <Component {...props} />
};

ReactDOM.render((<Router history={history} 
                         createElement={createElement}>
                         {routes}
                 </Router>), document.getElementById('app'));
