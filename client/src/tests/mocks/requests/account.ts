import * as nock from 'nock';

function mockRequests() {

  nock('http://localhost')
  .get('/auth/account')
    .once()
    .reply(404, {
      error: 'Some exception'
    });

  nock('http://localhost')
    .get('/auth/account')
      .twice()
      .reply(200, {
        account: 'account'
      });
}
export {
  mockRequests
};