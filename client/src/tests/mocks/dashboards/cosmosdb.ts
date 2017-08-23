import timespan from './timespan';
import { createDashboard } from "./utils";

let dashboard = createDashboard(timespan);
dashboard.config.connections["cosmos-db"] = { host: 'http://localhost:3000', key: 'someKey' };
dashboard.dataSources.push({
  id: "events",
  type: "CosmosDB/Query",
  dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan" },
  params: {
  	databaseId: "admin",
  	collectionId: "conversations",
  	query: () => `SELECT * FROM conversations WHERE (conversations.state = 0)`,
  	parameters: []
  },
  calculated: (result) => {
    return result;
  }
});

export default dashboard;