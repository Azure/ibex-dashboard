import * as React from 'react';

import ApplicationInsightsConnection from './application-insights';
import BotFrameworkConnection from './bot-framework';
import { IConnection } from './Connection';

var connectionTypes = [ ApplicationInsightsConnection, BotFrameworkConnection ];

var connections: IDict<IConnection> = {};
connectionTypes.forEach(connectionType => {
  var newConnection: IConnection = new connectionType();
  connections[newConnection.type] = newConnection;
});

export default connections;