import ApplicationInsightsQuery from './ApplicationInsights/Query';
import CosmosDBQuery from './CosmosDB/Query';
import BotFrameworkDirectLine from './BotFramework/DirectLine';
import Azure from './Azure';
import Constant from './Constant';

export default {
  'ApplicationInsights/Query': ApplicationInsightsQuery,
  'CosmosDB/Query': CosmosDBQuery,
  'Azure': Azure,
  'Constant': Constant,
  'BotFramework/DirectLine':BotFrameworkDirectLine
};
