import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';

export const FactsStore = Fluxxor.createStore({
  initialize() {
    this.dataStore = {
      facts: [],
      factDetail: null
    };

    this.bindActions(
      Actions.constants.FACTS.LOAD_FACTS, this.handleLoadFacts,
      Actions.constants.FACTS.LOAD_FACT, this.handleLoadFact
    );
  },

  getState() {
    return this.dataStore;
  },

  handleLoadFacts(facts) {
    this.dataStore.facts = this.dataStore.facts.concat(facts.response);
    this.emit("change");
  },

  handleLoadFact(fact) {
    this.dataStore.factDetail = fact.response;
    this.emit("change");
  }

});