import moment from 'moment';
import alt from '../alt';

import common from './actions-common';

class UsersActions {

  constructor() {
    this.generateActions(
      'refreshFail'
    );
  }

  refresh(timespan) {

    return (dispatch) => {

      var query = ` customEvents` +
        ` | where name == 'Activity' and customDimensions.activitytype == 'conversationUpdate' and timestamp > ago(365d)` +
        ` | summarize min_timestamp=min(timestamp), max(timestamp), count() by tostring(customDimensions.from)` +
        ` | order by min_timestamp desc `;
      var mappings = [
        { key: 'address', def: 'Unknown' },
        { key: 'minTimestamp', val: moment }, 
        { key: 'maxTimestamp', val: moment },
        { key: 'count', def: 0 }
      ];

      common.fetchQuery({ timespan, query, mappings }, (error, users) => {
        if (error) {
          return this.refreshFail(error)
        }

        return dispatch({ users, timespan });
      });
    }
  }
}

export default alt.createActions(UsersActions);