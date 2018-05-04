import timespan from './timespan';
import { createDashboard } from "./utils";

let dashboard = createDashboard(timespan);
dashboard.config.connections["bot-framework"] = { directLine: 'AbCdEf123456' };
dashboard.dataSources.push({
  id: 'events',
  type: 'BotFramework/DirectLine',
  dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
  params: {
  }
});

export default dashboard;