import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

import './index.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css'

import * as injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <Router history={browserHistory}>
    {routes}
  </Router>, 
  document.getElementById('app'));
