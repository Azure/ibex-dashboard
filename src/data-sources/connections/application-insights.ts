import Connection from './Connection';

export default class ApplicationInsightsConnection extends Connection {
  type = 'application-insights';
  params = [ 'appId', 'apiKey' ];
}