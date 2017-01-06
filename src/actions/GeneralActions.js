import $ from 'jquery';
import _ from 'lodash';
import alt from '../alt';

import common from './actions-common';

var appInsightsAppId = common.appInsightsAppId;
var appInsightsApiKey = common.appInsightsApiKey;

class GeneralActions {

  constructor() {
    this.generateActions(
      'refreshFail',
      'updateSearchTerm',
      'selectHandler',
      'searchResults',
      'searchFail',
      'selectError'
    );
  }

  refresh(timespan) {

    return (dispatch) => {

      var query = ` exceptions` +
        ` | summarize count_error=count() by handledAt, innermostMessage` +
        ` | order by count_error desc `
      var mappings = [
        { key: 'handledAt', def: 'Unknown' },
        { key: 'message', def: '' }, 
        { key: 'count', def: '' }
      ];

      common.fetchQuery({ timespan, query, mappings }, (error, results) => {
        if (error) {
          return this.refreshFail(error)
        }

        var errors = results;
        var handlers = {};
        errors.forEach(error => {
          if (!handlers[error.handledAt]) handlers[error.handledAt] = {
            name: error.handledAt,
            count: 0
          };
          handlers[error.handledAt].count += error.count;
        });

        return dispatch({
          errors,
          handlers: _.values(handlers),
          timespan
        });
      });
    }
  }

  queryExceptions(handledAt, timespan, searchQuery, top, skip) {

    top = top || 100;
    skip = skip || 0;

    var queryspan = timespan == '24 hours' ? 'PT24H' : timespan == '1 week' ? 'P7D' : 'P30D';
    var search = searchQuery ? `&$search=${encodeURIComponent(searchQuery)}` : '';
    var url = `${common.appInsights.uri}/${appInsightsAppId}/events/exceptions?timespan=${queryspan}` +
      search +
      `&&$orderby=timestamp&$top=${top}&$skip=${skip}`;

    $.ajax({
        url,
        method: "GET",
        headers: {
          "x-api-key": appInsightsApiKey
        }
      })
      .then(json => {

        return this.searchResults(json.value);
      })
      .fail((err) => {
        this.searchFail(err);
      });
  }
}

export default alt.createActions(GeneralActions);