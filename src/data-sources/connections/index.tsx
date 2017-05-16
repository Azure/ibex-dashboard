import * as React from 'react';

import ApplicationInsightsConnection from './application-insights';
import MongoDBConnection from './mongodb';
import { IConnection } from './Connection';

var connectionTypes = [ ApplicationInsightsConnection, MongoDBConnection];

var connections: IDict<IConnection> = {};
connectionTypes.forEach(connectionType => {
  var newConnection: IConnection = new connectionType();
  connections[newConnection.type] = newConnection;
});

export default connections;