import * as nock from 'nock';
import dashboardMock from '../../dashboards/bot-framework-directline';
import { DIRECT_LINE_URL } from '../../../../data-sources/plugins/BotFramework/DirectLine';

const { directLine } = dashboardMock.config.connections['bot-framework'];

/**
 * Mocking application insights requets
 */
function mockRequests() {
  let bearer = 'Bearer ' + directLine;
  nock('https://directline.botframework.com/', {
    reqheaders: {
      "Authorization": bearer
    }
  })
    .post('/v3/directline/conversations')
    .delay(100)
    // DirectLine doesn't support timespan based query, so the result is a stub JSON
    .reply(200, { values: 'fakedata' })
}
export {
  mockRequests
};
