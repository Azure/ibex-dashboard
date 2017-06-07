import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';
import { DataSourceConnector, IDataSourceDictionary } from '../../../../data-sources';

import ConstantDatasourceSettings from '../../../../data-sources/plugins/Constant/Settings'
import dashboardMock from '../../../mocks/dashboards/splitpanel';

describe('testing data-source settings component', () => {

  let dataSources: IDataSourceDictionary = {};
  
  beforeAll((done) => {

    DataSourceConnector.createDataSources(dashboardMock, dashboardMock.config.connections);
    dataSources = DataSourceConnector.getDataSources();

    let {id, dependencies, actions, props, title, subtitle } = dashboardMock.elements[0];
    let atts = {id, dependencies, actions, props, title, subtitle };
    splitpanel = TestUtils.renderIntoDocument(<SplitPanel {...(atts as any)} />);
    TestUtils.isElementOfType(splitpanel, 'div');

    setTimeout(done, 10);
  })

});