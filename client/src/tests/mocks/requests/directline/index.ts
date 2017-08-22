import * as nock from 'nock';
import dashboardMock from '../../dashboards/bot-framework-directline';
//import query24HResponseMock from './query.24h.mock';
import { DIRECT_LINE_URL } from '../../../../data-sources/plugins/BotFramework/DirectLine';

const { directLine } = dashboardMock.config.connections['bot-framework'];

/**
 * Mocking application insights requets
 */
function mockRequests() {
  let bearer = 'Bearer ' + directLine;
  console.log('###################################### bearer is');
  console.log(bearer);
  nock('https://directline.botframework.com/', {
    reqheaders: {
      "Authorization": bearer
    }
  })
    .post('/v3/directline/conversations')
    .delay(100)
    .reply(200, { values: 'a' })
    //, query24HResponseMock)

}
export {
  mockRequests
};
