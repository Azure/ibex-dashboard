import {DataStore} from './stores/DataStore';
import {Actions} from './actions/Actions';
import Fluxxor from 'fluxxor';
import {SERVICES} from './services/services';
import React from 'react';
import {default as ReactDOM} from "react-dom";
import {default as Router } from 'react-router'
import {routes} from './routes/routes';
import createHistory from 'history/lib/createHashHistory';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

let userProfile = (window.location.host.indexOf('localhost:')===-1)?SERVICES.getUserAuthenticationInfo():Actions.constants.USER_PROFILE;
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