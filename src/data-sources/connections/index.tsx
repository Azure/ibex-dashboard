import * as React from 'react';

import ApplicationInsightsConnection from './application-insights';
import CosmosDBConnection from './cosmos-db';
import { IConnection } from './Connection';

var connectionTypes = [ ApplicationInsightsConnection, CosmosDBConnection];

var connections: IDict<IConnection> = {};
connectionTypes.forEach(connectionType => {
  var newConnection: IConnection = new connectionType();
  connections[newConnection.type] = newConnection;
});

export default connections;