import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';

export const FactDetailStore = Fluxxor.createStore({
  initialize() {
    this.dataStore = {
      factDetail: null,
      error: null,
    };

    this.bindActions(
      Actions.constants.DASHBOARD.LOAD_DETAIL, this.handleLoadFact, 
      Actions.constants.DASHBOARD.LOAD_DETAIL_ERROR, this.handleLoadFactError 
    );
  },

  getState() {
    return this.dataStore;
  },

  handleLoadFact(payload) {
    this.dataStore.factDetail = payload.event;
    this.emit("change");
  },

    handleLoadFactError(error) {
    this.dataStore.error = error;
    this.emit("change");
  },

});