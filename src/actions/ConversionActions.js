import alt from '../alt';

import common from './actions-common';

class ConversionActions {

  constructor() {
    this.generateActions(
      'refreshFail'
    );
  }

  refresh(timespan) {

    return (dispatch) => {

      var query = ` customEvents` +
        ` | extend successful=customDimensions.successful` +
        ` | where name startswith 'message.convert'` +
        ` | summarize event_count=count() by name, tostring(successful)`;
      var mappings = [
        { key: 'name' },
        { key: 'successful', val: (val) => val === 'true' },
        { key: 'event_count', def: 0 }
      ];

      common.fetchQuery({ timespan, query, mappings }, (error, conversions) => {
        if (error) {
          return this.refreshFail(error)
        }

        return dispatch({ conversions, timespan });
      });
    }
  }
}

export default alt.createActions(ConversionActions);