import ConfigurationsStore from "../../stores/ConfigurationsStore";
import ConfigurationsActions from "../../actions/ConfigurationsActions";
import { mockRequests } from '../mocks/requests/configuration';
import dashboard from '../mocks/dashboards/dashboard';

describe('Data Source: ConfigurationsActions', () => {

  this.timeout = 10000;
    
  beforeAll(() => {
    mockRequests();
  })

  it ('Testing load configuration', (done) => {

    var checkState = (state) => {

      try {
        expect(state).toHaveProperty('dashboards');
        expect(state).toHaveProperty('templates');
        ConfigurationsStore.unlisten(checkState);
        done();
      } catch (e) {
        done(e);
        throw e;
      }
    }
    ConfigurationsStore.listen(checkState);
    (ConfigurationsActions.loadConfiguration as any).defer();
  })

  it ('Testing create dashboard', (done) => {

    var checkState = (state) => {
      try {
        // todo: add tests
        ConfigurationsStore.unlisten(checkState);
        done();
      } catch (e) {
        done(e);
        throw e;
      }
    };

    ConfigurationsStore.listen(checkState);
    (ConfigurationsActions.createDashboard as any).defer(dashboard);
  })
});
