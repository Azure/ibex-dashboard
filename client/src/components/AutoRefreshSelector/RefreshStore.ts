import alt, { AbstractStoreModel } from '../../alt';

import refreshActions from './RefreshActions';

export interface IRefreshStoreState {
  refreshInterval: number;
}

class RefreshStore extends AbstractStoreModel<IRefreshStoreState> implements IRefreshStoreState {

  refreshInterval: number;

  constructor() {
    super();

    this.bindListeners({
      updateInterval: refreshActions.updateInterval
    });
  }
  
  updateInterval(state: any) {
    this.refreshInterval = state.refreshInterval;
    
  }
}

const refreshStore = alt.createStore<IRefreshStoreState>(RefreshStore as AltJS.StoreModel<any>, 'RefreshStore');

export default refreshStore;
