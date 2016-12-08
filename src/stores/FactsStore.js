import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';
import { getFilteredResults } from '../utils/Fact.js';

export const FactsStore = Fluxxor.createStore({
  initialize() {
    this.dataStore = {
      facts: [],
      tags: [],
      error: null,
      loaded: false,
      skip: 0,
      pageSize: 50,
      settings: {},
      pageState: {
        filter: []
      },
      
      factDetail: null,
      factLinks: {
        prev: null,
        next: null
      },
      language:'en'
    };

    this.bindActions(
      Actions.constants.FACTS.CHANGE_LANGUAGE, this.handleLanguageChange,
      Actions.constants.FACTS.INITIALIZE, this.intializeSettings,
      Actions.constants.FACTS.LOAD_FACTS_SUCCESS, this.handleLoadFactsSuccess,
      Actions.constants.FACTS.LOAD_FACTS_FAIL, this.handleLoadFactsFail,
      Actions.constants.FACTS.SAVE_PAGE_STATE, this.handleSavePageState,
      Actions.constants.FACTS.LOAD_FACT_TAGS, this.handleLoadFactTags,
      Actions.constants.FACTS.LOAD_FACT, this.handleLoadFact
    );
  },

  getState() {
    return this.dataStore;
  },

  handleLanguageChange(language){
      this.dataStore.language = language;
      this.emit("change");
  },

  handleLoadFactsSuccess(payload) {
    this.dataStore.loaded = true;
    this.dataStore.error = null;
    this.dataStore.facts = this._processResults(payload.response);
    this._incrementSkip(payload.response);
    this.emit("change");
  },

  intializeSettings(siteSettings){
    this.dataStore.settings = siteSettings;
    this.emit("change");
  },

  _processResults(results) {
    return this.dataStore.facts.concat(results);
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
    this.dataStore.loaded = true;
    this.dataStore.error = payload.error;
  },

  handleSavePageState(pageState) {
    this.dataStore.pageState = pageState;
  },

  // fact tags
  handleLoadFactTags(payload) {
    this.dataStore.tags = payload.response;
    this.emit("change");
  },

  // fact detail 
  handleLoadFact(payload) {
    this.dataStore.factDetail = payload.response;
    this._getAdjacentArticles(this.dataStore.factDetail.id);
    this.emit("change");
  },

  // get prev and next fact using fact detail id
  _getAdjacentArticles(id) { 
    let loadedFacts = this.dataStore.facts;
    let filter = this.dataStore.pageState.filter;
    let facts = getFilteredResults(loadedFacts, filter);

    if (!facts.length > 0) {
      return;
    }
    let fact = facts.find(x => x.id === id);
    let index = facts.indexOf(fact);
    let l = facts.length;

    this.dataStore.factLinks.prev = this.dataStore.factLinks.next = null;
    if (index-1 < l) {
      this.dataStore.factLinks.prev = facts[index-1];
    }
    if (index+1 < l) {
      this.dataStore.factLinks.next = facts[index+1];
    }
  },

});