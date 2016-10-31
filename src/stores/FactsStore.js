import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';
import { flattenUnique } from '../utils/Utils.js';

export const FactsStore = Fluxxor.createStore({
  initialize() {
    this.dataStore = {
      facts: [],
      tags: [],
      error: null,
      loading: false,
      pageSize: 50,
      skip: 0,
      pageState: {
        scrollTop: 0,
        excludedHeight: 0,
        filter: "",
      },
      
      factDetail: null
    };

    this.bindActions(
      Actions.constants.FACTS.LOAD_FACTS, this.handleLoadFacts,
      Actions.constants.FACTS.LOAD_FACTS_SUCCESS, this.handleLoadFactsSuccess,
      Actions.constants.FACTS.LOAD_FACTS_FAIL, this.handleLoadFactsFail,
      Actions.constants.FACTS.SAVE_PAGE_STATE, this.handleSavePageState,
      // Detail view
      Actions.constants.FACTS.LOAD_FACT, this.handleLoadFact
    );
  },

  getState() {
    return this.dataStore;
  },

  handleLoadFacts() {
    this.dataStore.loading = true;
  },

  handleLoadFactsSuccess(payload) {
    this.dataStore.loading = false;
    this.dataStore.error = null;
    this.dataStore.facts = this._processResults(payload.response);
    this._incrementSkip(payload.response);
    this.emit("change");
  },

  _processResults(results) {
    var facts = this.dataStore.facts.concat(results);
    // update list of unique tags
    this.dataStore.tags = flattenUnique( facts.map(x => x.tags) );
    return facts;
  },

  _incrementSkip(results) {
    // Total no. of items in each new section should be equal to page size...
    var count = results.length;
    if (count === this.dataStore.pageSize) {
      return this.dataStore.skip += this.dataStore.pageSize;
    }
    // Otherwise, skip last remaining items
    return this.dataStore.skip += count;
  },

  handleLoadFactsFail(payload) {
    this.dataStore.loading = false;
    this.dataStore.error = payload.error;
  },

  handleSavePageState(pageState) {
    this.dataStore.pageState = pageState;
  },

  handleLoadFact(payload) {
    this.dataStore.factDetail = payload.response;
    this.emit("change");
  }

});