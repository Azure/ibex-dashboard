import * as nock from 'nock';
import dashboardMock from '../../dashboards/cosmosdb';
import { COSMOS_DB_QUERY_URL } from '../../../../data-sources/plugins/CosmosDB/Query';

const { host, key } = dashboardMock.config.connections['cosmos-db'];

/**
 * Mocking application insights requets
 */
function mockRequests() {
  nock('http://localhost', {
  })
    .post('/cosmosdb/query')
    .delay(100)
    .reply(200, { Documents: 'fakedata' })
}
export {
  mockRequests
};
