import _ from 'lodash';
import alt from '../alt';
import ConversionActions from '../actions/ConversionActions';

class ConversionStore {
  constructor() {
    this.bindListeners({
      refresh: ConversionActions.refresh,
    });

    this.state = {
      conversions: [],
      timespan: null,
    };
  }

  refresh(result) {
    this.setState(result);
  }
}

export default alt.createStore(ConversionStore, 'ConversionStore');
