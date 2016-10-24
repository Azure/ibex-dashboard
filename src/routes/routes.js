import { Route} from 'react-router'
import {AppPage} from './AppPage';
import {EntryPage} from './EntryPage';
import {FactsPage} from './FactsPage';
import {FactDetailPage} from './FactDetailPage';
import React from 'react';

export const routes = (
    <Route>
    	<Route path="/" component={AppPage} linkLabel="My App" href="/" icon="fa fa-share-alt-square fa">
            <Route path="/site/:siteKey" component={EntryPage} />
            <Route path="/site/:siteKey/facts" component={FactsPage} href="#/site/:siteKey/facts/" />
            <Route path="/site/:siteKey/facts/:factId" component={FactDetailPage} />
        </Route>
    </Route>
);
