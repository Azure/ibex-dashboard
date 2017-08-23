import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import ConfigurationsStore from '../../stores/ConfigurationsStore';
import ConfigurationsActions from '../../actions/ConfigurationsActions';
import { mockRequests } from '../mocks/requests/configuration';
import dashboard from '../mocks/dashboards/dashboard';
import utils from '../../utils';

describe('Data Source: ConfigurationsActions', () => {

  this.timeout = 10000;
    
  beforeAll(() => {
    Object.defineProperty(window.location, 'href', {
      value: '',
      configurable: true,
      writable: true
    });    
    window.location.replace = (url) => {
      window.location.href = url;
    };

    mockRequests();
  });

  it ('Testing load configuration', done => {

    var checkState = (state) => {

      try {
        expect(state).toHaveProperty('dashboards');
        expect(state).toHaveProperty('templates');
        ConfigurationsStore.unlisten(checkState);
        done();
      } catch (e) {
        done.fail(e);
      }
    };

    ConfigurationsStore.listen(checkState);
    (ConfigurationsActions.loadConfiguration as any).defer();
  });

  it ('Testing create dashboard', done => {

    var checkState = (state) => {
      try {
        ConfigurationsStore.unlisten(checkState);
        done();
      } catch (e) {
        done.fail(e);
      }
    };

    ConfigurationsStore.listen(checkState);
    (ConfigurationsActions.createDashboard as any).defer(dashboard);
  });

  it ('submitDashboardFile', done => {
    mockRequests();

    expect(window.location.href).toBe('');
    ConfigurationsActions.submitDashboardFile(utils.convertDashboardToString(dashboard), 'id');

    setTimeout(() => {
      try {
        expect(window.location.href).toBe('dashboard/id');
        done();
      } catch (e) {
        done.fail(e);
      }
    }, 10);


  });
});
