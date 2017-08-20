import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import SetupComponent from '../../components/Setup';

import dashboardMock from '../mocks/dashboards/dashboard';

describe('Setup', () => {

  let setupComponent;

  it('Check Setup Page is loading', () => {
    // This test is just to make sure the component is able to render
    setupComponent = TestUtils.renderIntoDocument(<SetupComponent />);
  });

  afterAll(() => {
    ReactDOM.unmountComponentAtNode(setupComponent);
  })
});