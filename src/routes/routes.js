import { Router, Route, IndexRoute, Link } from 'react-router'
import {EntryPage} from './EntryPage';
import React, { PropTypes, Component } from 'react';
const DefaultRoute = Router.DefaultRoute;

export const routes = (
    <Route>
    	<Route path="/" component={EntryPage} linkLabel="My App" href="/" icon="fa fa-share-alt-square fa" />
    </Route>
);
