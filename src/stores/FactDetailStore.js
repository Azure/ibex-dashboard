import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';

export const FactDetailStore = Fluxxor.createStore({
  initialize() {
    this.dataStore = {
      factDetail: null
    };

    this.bindActions(
      Actions.constants.FACTS.LOAD_FACT, this.handleLoadFact
    );
  },

  getState() {
    return this.dataStore;
  },

  handleLoadFact(payload) {
    this.dataStore.factDetail = payload.response;
    this.emit("change");
  },

});