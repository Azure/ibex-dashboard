import * as React from 'react';

import ApplicationInsightsConnection from './application-insights';
import CosmosDBConnection from './cosmos-db';
import AzureConnection from './azure';
import { IConnection } from './Connection';

var connectionTypes = [ ApplicationInsightsConnection, AzureConnection, CosmosDBConnection ];

var connections: IDict<IConnection> = {};
connectionTypes.forEach(connectionType => {
  var newConnection: IConnection = new connectionType();
  connections[newConnection.type] = newConnection;
});

export default connections;