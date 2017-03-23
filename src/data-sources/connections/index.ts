import ApplicationInsightsConnection from './application-insights';
import Connection from './Connection';

var connectionTypes = [ ApplicationInsightsConnection ];

var connections: IDict<Connection> = {};
connectionTypes.forEach(connectionType => {
  var newConnection: Connection = new connectionType();
  connections[newConnection.type] = newConnection;
});

export default connections;