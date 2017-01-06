import _ from 'lodash';
import alt from '../alt';
import ErrorsActions from '../actions/ErrorsActions';

class ErrorsStore {
  constructor() {
    this.bindListeners({
      refresh: ErrorsActions.refresh,
      selectHandler: ErrorsActions.selectHandler,
      updateSearchTerm: ErrorsActions.updateSearchTerm,
      searchResults: ErrorsActions.searchResults,
      selectError: ErrorsActions.selectError
    });

    this.state = {
      errors: [],
      handlers: [],
      timespan: null,
      selectedHandler: null,
      searchTerm: null,
      searchResults: [],
      selectedError: null
    };
  }

  refresh(result) {
    this.setState(result);
  }
  
  selectHandler(handledAt) {
    this.setState({ selectedHandler: handledAt, searchTerm: null });
  }

  updateSearchTerm(searchTerm) {
    this.setState({ searchTerm })
  }

  searchResults(results) {
    this.setState({ searchResults: results });
  }

  selectError(selectedError) {
    this.setState({ selectedError });
  }
}

export default alt.createStore(ErrorsStore, 'ErrorsStore');
