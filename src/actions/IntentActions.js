import $ from 'jquery';
import _ from 'lodash';
import alt from '../alt';

import common from './actions-common';

var appInsightsAppId = common.appInsightsAppId;
var appInsightsApiKey = common.appInsightsApiKey;

class IntentActions {

  constructor() {
    this.generateActions(
      'refreshFail',
      'selectIntent',
      'selectConversation'
    );
  }

  refresh (timespan) {

    var queryspan = common.timespanToQueryspan(timespan);
    var query = ` customEvents` + 
                   ` | extend cslen = customDimensions.callstack_length, intent=customDimensions.intent` +
                   ` | where name startswith "message.intent" and (cslen == 0 or strlen(cslen) == 0) and strlen(intent) > 0` +
                   ` | summarize event_count=count() by tostring(intent)`;
    var url = `${common.appInsights.uri}/${appInsightsAppId}/query?timespan=${queryspan}&query=${encodeURIComponent(query)}`;

    return (dispatch) => {

      $.ajax({
        url,
        method: "GET",
        headers: { "x-api-key": appInsightsApiKey }
      })
      .then(json => {
        
        var _intents = [];
        json.Tables[0].Rows.forEach(row => {
          var intent = row[0] || 'Unknown';
          var count = row[1] || 0;
          
          _intents.push({ intent, count });
        });

        return dispatch({ intents: _intents, timespan });
      })
      .fail((err) => {
        this.refreshFail(err);
      })
    };
  }

  fetchIntentConversations(intent, timespan) {
    
    var queryspan = 'P30D';
    var query = ` customEvents` + 
                   ` | extend conversation = customDimensions.conversationId, intent=customDimensions.intent` +
                   ` | where name startswith "message.intent" and intent =~ '${intent}'` +
                   ` | summarize event_count=count() by tostring(conversation)`;
    var url = `${common.appInsights.uri}/${appInsightsAppId}/query?timespan=${queryspan}&query=${encodeURIComponent(query)}`;

    return (dispatch) => {

      $.ajax({
        url,
        method: "GET",
        headers: { "x-api-key": appInsightsApiKey }
      })
      .then(json => {
        
        var _conversations = [];
        json.Tables[0].Rows.forEach(row => {
          var conversation = row[0] || 'Unknown';
          var count = row[1] || 0;
          
          _conversations.push({ conversation, count });
        });

        return dispatch(_conversations);
      })
      .fail((err) => {
        this.refreshFail(err);
      })
    };
  }

  fetchConversationMessages(conversation, timespan) {
    
    var queryspan = 'P30D';
    var query = ` customEvents` + 
                   ` | extend conversation = customDimensions.conversationId, intent=customDimensions.intent` +
                   ` | where name in ("message.send", "message.received") and conversation == '${conversation}'` +
                   ` | order by timestamp asc` +
                   ` | project timestamp, name, customDimensions.text, customDimensions.userName, customDimensions.userId`;
    var url = `${common.appInsights.uri}/${appInsightsAppId}/query?timespan=${queryspan}&query=${encodeURIComponent(query)}`;

    return (dispatch) => {

      $.ajax({
        url,
        method: "GET",
        headers: { "x-api-key": appInsightsApiKey }
      })
      .then(json => {
        
        var messages = json.Tables[0].Rows.map(row => {
          var timestamp = row[0];
          var eventName = row[1];
          var message = row[2];
          var userName = row[3];
          var userId = row[4];
          
          return { timestamp, eventName, message, userName, userId };
        });

        return dispatch(messages);
      })
      .fail((err) => {
        this.refreshFail(err);
      })
    };
  }
}

export default alt.createActions(IntentActions);