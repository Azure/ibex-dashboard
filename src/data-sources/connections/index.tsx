import * as React from 'react';

import ApplicationInsightsConnection from './application-insights';
import BotFrameworkConnection from './bot-framework';
import AzureConnection from './azure';
import { IConnection } from './Connection';

var connectionTypes = [ ApplicationInsightsConnection, AzureConnection, BotFrameworkConnection ];

var connections: IDict<IConnection> = {};
connectionTypes.forEach(connectionType => {
  var newConnection: IConnection = new connectionType();
  connections[newConnection.type] = newConnection;
});

export default connections;