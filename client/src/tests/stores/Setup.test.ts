import SetupStore from "../../stores/SetupStore";
import SetupActions from "../../actions/SetupActions";

describe('Data Source: Samples', () => {

  this.timeout = 10000;
  beforeAll(() => {
  })

  it('Testing SetupActions', (done) => {

    let checkState = (state) => {
      expect(state).toHaveProperty('admins');
      expect(state).toHaveProperty('allowHttp');
      expect(state).toHaveProperty('clientID');
      expect(state).toHaveProperty('clientSecret');
      expect(state).toHaveProperty('enableAuthentication');
      expect(state).toHaveProperty('issuer');
      expect(state).toHaveProperty('loaded');
      expect(state).toHaveProperty('redirectUrl');
      expect(state).toHaveProperty('saveSuccess');
      expect(state).toHaveProperty('stage');

      SetupStore.unlisten(checkState);
      done();
    };

    SetupStore.listen(checkState);
    (SetupActions.load as any).defer();
  });
})
