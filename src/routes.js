import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Generic from './components/Generic';
import NotFound from './components/NotFound';

export default (
  <Route component={App}>
    <Route path="/" component={Dashboard} />
    <Route path="/generic" component={Generic} />
    <Route path="*" component={NotFound} />
  </Route>
);