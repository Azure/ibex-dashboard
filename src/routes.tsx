import * as React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import ConfigDashboard from './components/ConfigDashboard';

export default (
  <Route component={App}>
    <Route path="/" component={Dashboard} />
    <Route path="/about" component={About} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/dashboard/config" component={ConfigDashboard} />
    <Route path="*" component={NotFound} />
  </Route>
);