import { IDataSourceDictionary } from '../../data-sources';
import { setupTests } from '../utils/setup';
import { DIRECT_LINE_URL } from '../../data-sources/plugins/BotFramework/DirectLine';

import { mockRequests } from '../mocks/requests/directline';
import dashboardMock from '../mocks/dashboards/bot-framework-directline';

describe('Data Source: DirectLine: Query', () => {

  let dataSources: IDataSourceDictionary = {};

  beforeAll(() => {

    mockRequests();
    dataSources = setupTests(dashboardMock);
  });

  it ('Query for 24 hours with 1 rows', () => {
    // dataSources.timespan.action.updateSelectedValue.defer('24 hours');

    return new Promise((resolve, reject) => {
      var stateUpdate = (state => {
        try {
          expect(state).toHaveProperty('values');
          //expect(state.values).toHaveLength(1);
          return resolve();
        } catch (e) {
          return reject(e);
        } finally {
          dataSources.events.store.unlisten(stateUpdate);
        }
      });
      dataSources.events.store.listen(stateUpdate);
    });
  });
});
