import * as nock from 'nock';
import dashboardMock, {databaseId, collectionId, query} from '../../dashboards/cosmos-db';
import mockResponse from './query.mock';
import { apiUri } from '../../../../data-sources/plugins/CosmosDB/common';

const { host, key } = dashboardMock.config.connections['cosmos-db'];
const queryApi = '/cosmosdb/query';

/**
 * Mocking Cosmos DB requests
 */
function mockRequests() {

  let body = {
    host: host,
    key: key,
    verb: 'POST',
    databaseId: databaseId,
    collectionId: collectionId,
    resourceType: 'docs',
    query: query,
    parameters: []
  };

  nock(apiUri, {
    reqheaders: {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  })
    .post(queryApi, body)
    .delay(100)
    .reply(200, mockResponse);
}

export {
  mockRequests
};