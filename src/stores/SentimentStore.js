import _ from 'lodash';
import alt from '../alt';
import SentimentActions from '../actions/SentimentActions';

class SentimentStore {
  constructor() {
    this.bindListeners({
      refresh: SentimentActions.refresh,
    });

    this.state = {
      sentiments: [],
      timespan: null,
    };
  }

  refresh(result) {
    this.setState(result);
  }
}

export default alt.createStore(SentimentStore, 'SentimentStore');
