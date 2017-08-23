import SetupStore from "../../stores/SetupStore";
import SetupActions from "../../actions/SetupActions";

describe('Data Source: Samples', () => {

  this.timeout = 10000;
  beforeAll(() => {
  })

  it('Testing SetupActions', (done) => {

    let checkState = (state) => {
      expect(state).toMatchSnapshot('SetupActionsLoad')

      SetupStore.unlisten(checkState);
      done();
    };

    SetupStore.listen(checkState);
    (SetupActions.load as any).defer();
  });
})
