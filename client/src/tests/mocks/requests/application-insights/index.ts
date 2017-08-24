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

  nock(appInsightsUri, {
    reqheaders: {
      "x-api-key": apiKey
    }
  })
    .post(`/${appId}/query?timespan=PT24H`)
    .delay(10)
    .reply(200, query24HResponseMock)
    .post(`/${appId}/query?timespan=P30D`)
    .delay(10)
    .reply(200, query30DResponseMock)
    .post(`/id_fail/query?timespan=P30D`)
    .delay(10)
    .reply(404, 'Some error');

}
export {
  mockRequests
};