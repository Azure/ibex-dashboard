import * as React from 'react';
import { Route } from 'react-router';

import App from './components/App';
//import Dashboard from './components/Dashboard';
import Generic from './components/generic';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

export default (
  <Route component={App}>
    <Route path="/" component={Dashboard} />
    <Route path="/generic" component={Generic} />
    <Route path="/about" component={About} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="*" component={NotFound} />
  </Route>
);