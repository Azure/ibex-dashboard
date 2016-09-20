import { Route} from 'react-router'
import {EntryPage} from './EntryPage';
import React from 'react';

export const routes = (
    <Route>
    	<Route path="/" component={EntryPage} linkLabel="My App" href="/" icon="fa fa-share-alt-square fa">
            <Route path="/site(/:siteKey)" component={EntryPage} />
        </Route>
    </Route>
);
