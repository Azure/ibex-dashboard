import utils from "../../utils";
import AccountActions from "../../actions/AccountActions";
import { mockRequests } from '../mocks/requests/account';

describe('Utils', () => {

  it ('Ago', () => {
    let time = new Date();
    time.setSeconds(time.getSeconds() - 10);
    expect(utils.ago(time)).toBe('10 seconds ago');
  });
});
