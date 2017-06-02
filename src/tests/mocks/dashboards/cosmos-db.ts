import timespan from './timespan';
import { createDashboard } from './utils';

let dashboard = createDashboard(timespan);
dashboard.config.connections['cosmos-db'] = { 'host': 'hostname', 'key': 'password' };

const databaseId = 'admin';
const collectionId = 'conversations';
const query = `SELECT * FROM ${collectionId}`;

dashboard.dataSources.push({
  id: 'data',
  type: 'CosmosDB/Query',
  dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
  params: {
    databaseId: databaseId,
    collectionId: collectionId,
    query: query,
    parameters: []
  }
});

export default dashboard;
export { databaseId, collectionId, query };