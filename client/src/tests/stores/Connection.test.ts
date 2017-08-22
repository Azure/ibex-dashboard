import ConnectionsStore from "../../stores/ConnectionsStore";
import ConnectionsActions from "../../actions/ConnectionsActions";
//import { mockRequests } from '../mocks/requests/account';

describe('Data Source: Samples', () => {

  beforeAll(() => {
   // mockRequests();
  })

  it ('Testing SetupActions', (done) => {

    ConnectionsStore.listen((state) => {
      expect(state).toHaveProperty('connections');
      done();
    });
    ConnectionsActions.updateConnection('Conn name', {});
  });
})
