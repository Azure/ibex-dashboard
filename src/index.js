import {DataStore} from './stores/DataStore';
import {FactsStore} from './stores/FactsStore';
import {AdminStore} from './stores/AdminStore';
import {Actions} from './actions/Actions';
import Fluxxor from 'fluxxor';
import {SERVICES} from './services/services';
import React from 'react';
import {default as ReactDOM} from "react-dom";
import { Router, hashHistory } from 'react-router';
import {routes} from './routes/routes';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

let userProfile = (window.location.host.indexOf('localhost:')===-1)?SERVICES.getUserAuthenticationInfo():Actions.constants.USER_PROFILE;

let stores = {
  DataStore: new DataStore(userProfile),
  FactsStore: new FactsStore(),
  AdminStore: new AdminStore()
};

let flux = new Fluxxor.Flux(stores, Actions.methods);

const createElement = (Component, props) => {
    props.flux = flux;
    return <Component {...props} />
};

ReactDOM.render((<Router history={hashHistory}
                         createElement={createElement} 
                         routes={routes} />), 
                  document.getElementById('app'));
