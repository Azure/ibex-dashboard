import _ from 'lodash';
import alt from '../alt';
import UsersActions from '../actions/UsersActions';

class UsersStore {
  constructor() {
    this.bindListeners({
      refresh: UsersActions.refresh,
    });

    this.state = {
      users: [],
      timespan: null,
    };
  }

  refresh(result) {
    this.setState(result);
  }
}

export default alt.createStore(UsersStore, 'UsersStore');
