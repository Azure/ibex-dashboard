import SettingsStore from "../../stores/SettingsStore";
import SettingsActions from "../../actions/SettingsActions";

describe('Data Source: Samples', () => {

  this.timeout = 10000;

  beforeAll(() => {
  });


   it ('Testing SetupActions - failure message', done => {

    //fff(Store, test, callback)

    let checkState = state => {
      expect(state).toHaveProperty('isSavingSettings');
      expect(state.isSavingSettings).toEqual(false);
     
      SettingsStore.unlisten(checkState);
      done();
    };
    SettingsStore.listen(checkState);

    (SettingsActions.saveSettingsCompleted as any).defer();
  });


  it ('Testing SetupActions', done => {

    let checkState = state => {
      expect(state).toHaveProperty('isSavingSettings');
      expect(state.isSavingSettings).toEqual(true);

      SettingsStore.unlisten(checkState);
      done();
    };
    SettingsStore.listen(checkState);

    (SettingsActions.saveSettings as any).defer();
  });
})
