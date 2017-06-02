import { IDataSourceDictionary } from '../../data-sources';
import { setupTests } from '../utils/setup';

import { mockRequests } from '../mocks/requests/cosmos-db';
import dashboardMock from '../mocks/dashboards/cosmos-db';

describe('Data Source: Cosmos DB: Query', () => {

  let dataSources: IDataSourceDictionary = {};

  beforeAll(() => {
    mockRequests();
    dataSources = setupTests(dashboardMock);
  });

  it ('Query all Documents', () => {
    expect(dataSources).toHaveProperty('data');
    expect(dataSources.timespan).toHaveProperty('store');
    expect(dataSources.data).toHaveProperty('store');
    expect(dataSources.data).toHaveProperty('action');
    expect(dataSources.data.store).toHaveProperty('state');

    // Listening to store to catch values arrival from app insights
    return new Promise((resolve, reject) => {
      var stateUpdate = (state => {
        try {
          expect(state).toHaveProperty('Documents');
          expect(state).toHaveProperty('_count');
          expect(state).toHaveProperty('_rid');
          expect(state['Documents'].length).toEqual(state._count);
          return resolve();
        } catch (e) {
          return reject(e);
        } finally {
          dataSources.data.store.unlisten(stateUpdate);
        }
      });
      dataSources.data.store.listen(stateUpdate);
    });
  });

});

