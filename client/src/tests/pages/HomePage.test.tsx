import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import { Card } from 'react-md/lib/Cards';

import * as Home from '../../pages/Home';
import HomeComponent from '../../components/Home';

import { DataSourceConnector, IDataSourceDictionary } from '../../data-sources';

import dashboardMock from '../mocks/dashboards/pie';
import ElementConnector from '../../components/ElementConnector';

describe('HomePage', () => {

  let dataSources: IDataSourceDictionary = {};
  let homepage;

  beforeAll((done) => {
    DataSourceConnector.createDataSources(dashboardMock, dashboardMock.config.connections);
    dataSources = DataSourceConnector.getDataSources();

    setTimeout(() => {

      try {
        let {id, dependencies, source, actions, props, title, subtitle } = dashboardMock.elements[0];
        let atts = {id, dependencies, source, actions, props, title, subtitle };
        let autoRefresherElement = ElementConnector.createGenericElement(
          HomeComponent, 
          'autorefresher', 
          0, 
          source, 
          dependencies, 
          actions, 
          props, 
          title, 
          subtitle);
        homepage = TestUtils.renderIntoDocument(autoRefresherElement);
        TestUtils.isElementOfType(homepage, 'div');

        // Adding a timeout to make sure Flux cycle is complete
        setTimeout(done, 100);
        
      } catch (e) {
        return done(e);
      }

    }, 100);
  })

  it('Check Home page is loading', () => {
    // This test is just to make sure the component is able to render
  });

  afterAll(() => {
    ReactDOM.unmountComponentAtNode(homepage);
  })
});