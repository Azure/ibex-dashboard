import moment from 'moment';
import alt from '../alt';

import common from './actions-common';

class SentimentActions {

  constructor() {
    this.generateActions(
      'refreshFail'
    );
  }

  refresh(timespan) {

    return (dispatch) => {

      var query = ` customEvents` +
        ` | extend score=customDimensions.score, text=customDimensions.text` +
        ` | where name startswith 'message.sentiment'` +
        ` | summarize sentiment=avg(todouble(score))`;
      var mappings = [
        { key: 'sentiment' }
      ];

      common.fetchQuery({ timespan, query, mappings }, (error, sentiments) => {
        if (error) {
          return this.refreshFail(error)
        }

        return dispatch({ sentiments, timespan });
      });
    }
  }
}

export default alt.createActions(SentimentActions)