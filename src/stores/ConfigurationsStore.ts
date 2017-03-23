import alt, { AbstractStoreModel } from '../alt';

import configurationActions from '../actions/ConfigurationsActions';

interface IConfigurationsStoreState {
  dashboard: IDashboardConfig;
}

class ConfigurationsStore extends AbstractStoreModel<IConfigurationsStoreState> implements IConfigurationsStoreState {

  dashboard: IDashboardConfig;

  constructor() {
    super();

    this.dashboard = null;

    this.bindListeners({
      loadConfiguration: configurationActions.loadConfiguration
    });
  }
  
  loadConfiguration(dashboard: IDashboardConfig) {
    this.dashboard = dashboard;
  }
}

const configurationsStore = alt.createStore<IConfigurationsStoreState>(ConfigurationsStore, 'ConfigurationsStore');

export default configurationsStore;
