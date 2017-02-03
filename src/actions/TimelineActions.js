import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import alt from '../alt';

import common from './actions-common';
import TimelineStore from '../stores/TimelineStore';

var appInsightsAppId = common.appInsightsAppId;
var appInsightsApiKey = common.appInsightsApiKey;

class TimelineActions {

  constructor() {
    this.generateActions(
      'refreshFail', 
      'dismissError',
      'updateMode'
    );
  }

  refresh (timespan) {

    var state = TimelineStore.getState();
    var queryspan = common.timespanToQueryspan(timespan);
    var granularity = common.timespanToGranularity(timespan);

    // Query messages per time
    var query1 = ` customEvents` +
                   ` | where name == 'Activity'` + 
                   ` | summarize event_count=count() by bin(timestamp, ${granularity}), name, tostring(customDimensions.channel)` +
                   ` | order by timestamp asc `;

    // Query users per time
    var query2 = ` customEvents` +
                  ` | where name == 'Activity'` +
                  ` | summarize event_count=dcount(tostring(customDimensions.from)) by bin(timestamp, ${granularity}), name, tostring(customDimensions.channel)` +
                  ` | order by timestamp asc`;
    
    var query = state.mode == 'users' ? query2 : query1;
    var url = `${common.appInsights.uri}/${appInsightsAppId}/query?timespan=${queryspan}&query=${encodeURIComponent(query)}`;

    return (dispatch) => {

      $.ajax({
        url,
        method: "GET",
        headers: { "x-api-key": appInsightsApiKey }
      })
      .then(json => {
        
        var now = moment();

        var _timeline = {};
        var _channels = {};
        json.Tables[0].Rows.forEach(row => {
          var channel = row[2] || 'unknown';
          var time = (new Date(row[0])).getTime();
          var count = row[3];
          
          if (!_timeline[time]) _timeline[time] = { time: (new Date(row[0])).toUTCString() };
          if (!_channels[channel]) _channels[channel] = { name: channel, value: 0 };

          _timeline[time][channel] = count;
          _channels[channel].value += count;
        });

        var channels = Object.keys(_channels);
        var channelUsage = _.values(_channels);
        var timeline = _.map(_timeline, value => {
          channels.forEach(channel => {
            if (!value[channel]) value[channel] = 0;
          });
          return value;
        });

        return dispatch({ data: timeline, channelUsage, channels, timespan });
      })
      .fail((err) => {
        this.refreshFail(err);
      })
    };
  }
}

export default alt.createActions(TimelineActions);
