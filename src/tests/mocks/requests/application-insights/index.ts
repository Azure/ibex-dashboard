import * as nock from 'nock';
import dashboardMock from '../../dashboards/application-insights';
import query24HResponseMock from './query.24h.mock';
import query30DResponseMock from './query.30d.mock';
import { appInsightsUri } from '../../../../data-sources/plugins/ApplicationInsights/common';

const { appId, apiKey } = dashboardMock.config.connections['application-insights'];

/**
 * Mocking application insights requets
 */
function mockRequests() {

  nock(appInsightsUri)
  .post(`/query?timespan=PT24H`)
  .delay(100)
  .reply(200, query24HResponseMock)
  .post(`/query?timespan=P30D`)
  .delay(100)
  .reply(200, query30DResponseMock);
}

export {
  mockRequests
};