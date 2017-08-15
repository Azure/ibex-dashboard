import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import { Card } from 'react-md/lib/Cards';
import { PieChart, Pie, Sector, Cell, Legend, Layer } from 'recharts';

import { Spinner, SpinnerActions } from '../../components/Spinner';
import PieData from '../../components/generic/PieData';
import { DataSourceConnector, IDataSourceDictionary } from '../../data-sources';

//import dataSourceMock from '../mocks/dataSource';
import dashboardMock from '../mocks/dashboards/pie';
import ElementConnector from "../../components/ElementConnector";

describe('Pie', () => {

  let dataSources: IDataSourceDictionary = {};
  let pie;

  beforeAll((done) => {

    DataSourceConnector.createDataSources(dashboardMock, dashboardMock.config.connections);
    dataSources = DataSourceConnector.getDataSources();

    setTimeout(() => {

      try {
        let {id, dependencies, source, actions, props, title, subtitle } = dashboardMock.elements[0];
        let atts = {id, dependencies, source, actions, props, title, subtitle };
        let pieElement = ElementConnector.createGenericElement(
          PieData, 
          'pie', 
          0, 
          source, 
          dependencies, 
          actions, 
          props, 
          title, 
          subtitle);
        pie = TestUtils.renderIntoDocument(pieElement);
        TestUtils.isElementOfType(pie, 'div');
      }
      catch (e) {
        console.error(e);
      }
      setTimeout(done, 100);

    }, 100);
  })

  it('Render inside a Card', () => {
    let card = TestUtils.scryRenderedComponentsWithType(pie, Card);
    expect(card.length).toBe(1);
  });

  it('Render a Pie entity', () => {
    let pieElement = TestUtils.scryRenderedComponentsWithType(pie, Pie);
    expect(pieElement.length).toBe(1);
    let pieChartElement = TestUtils.scryRenderedComponentsWithType(pie, PieChart);
    expect(pieChartElement.length).toBe(1);
  });

  it('Rows == 4', () => {
    let cells = TestUtils.scryRenderedComponentsWithType(pie, Sector);
    expect(cells.length).toBe(4);
  });

  it('Appropriate texts', () => {
    let textElements = TestUtils.scryRenderedDOMComponentsWithTag(pie, 'text');
    expect(textElements.length).toBe(3);
    expect(textElements[0].textContent).toBe('red');
    expect(textElements[1].textContent).toBe('150 Messages');
    expect(textElements[2].textContent).toBe('(56.18%)');
  });

  afterAll(() => {
    ReactDOM.unmountComponentAtNode(pie);
  })
});