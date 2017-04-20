import alt, { AbstractStoreModel } from '../alt';

import configActions from '../actions/ConfigActions';

interface IConfigStoreState {
  configs: IDictionary;
}

class ConfigStore extends AbstractStoreModel<IConfigStoreState> implements IConfigStoreState {

  configs: IDictionary;

  constructor() {
    super();

    this.configs = {};

    this.bindListeners({
      update: configActions.update
    });
  }
  
  update(configName: string, args: IDictionary) {
    this.configs[configName] = args;
  }
}

const configStore = alt.createStore<IConfigStoreState>(ConfigStore, 'ConfigStore');

export default configStore;
