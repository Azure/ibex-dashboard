import $ from 'jquery';
import moment from 'moment';
import _ from 'lodash';

var appInsights = {
  uri: 'https://api.applicationinsights.io/beta/apps',
  apps: {
    murphy: {
      appId: "",
      apiKey: ""
    },
    morshe: {
      appId: "",
      apiKey: ""
    }
  }
};

var appInsightsAppId = appInsights.apps['murphy'].appId;
var appInsightsApiKey = appInsights.apps['murphy'].apiKey;

var _messages = {};
var _activity = {};
var _talk = {};

class ChartsData {

  roundSeconds (time) {
      var sec = Math.round(time.getSeconds() / 3) * 3;
      return sec >= 10 ? sec.toString() : '0' + sec.toString();
  }

  collectActivity (now, cevent, timeline) {
    var cd = cevent.customDimensions;
    if (!_activity[cd.conversation]) {
        _activity[cd.conversation] = {
            id: cd.conversation,
            channel: cd.channel,
            messages: [],
            messageCount: 0,
            lastActive: null
        };
    }
    _activity[cd.conversation].messages.push(cevent);
    _activity[cd.conversation].messageCount++;
    _activity[cd.conversation].lastActive = new Date(cd.timestamp);
    // Updating new events in timeline
    var t = moment(cevent.timestamp);
    if (moment.duration(t.diff(now)).minutes() < 5) {
        t.seconds(Math.round(t.seconds() / 3) * 3);
        t.milliseconds(0);
        var iso = t.toISOString();
        timeline[iso] = timeline[iso] || {
            key: t.toDate(),
            count: 0
        };
        timeline[iso].count++;
    }
  }

  collectTalk (cevent) {
    var message = cevent.customDimensions;
    message.name = cevent.customEvent.name;
    
    if (!_talk[message.conversationId]) {
      _talk[message.conversationId] = {
        conversationId: message.conversationId,
        messages: []
      }
    }

    _talk[message.conversationId].messages.push(message);
  }

  collectIntents (cevent) {
    return;
  }

  getTimelineMessages(callback, time) {
    var timespan = time == '24 hours' ? 'PT24H' : time == '1 week' ? 'P7D' : 'P30D';
    var granularity = time == '24 hours' ? '1h' : time == '1 week' ? '1d' : '1d';

    var url = `${appInsights.uri}/${appInsightsAppId}/query?timespan=${timespan}&query=customEvents%20%7C%20summarize%20event_count%3Dcount()%20by%20bin(timestamp%2C%20${granularity})%2C%20name%7C%20order%20by%20timestamp%20asc`;

    $.ajax({
      method: "GET",
      url: url,
      headers: {
        "x-api-key": appInsightsApiKey
      }
    })
    .then(json => {
      
      var now = moment();

      var _timeline = json.Tables[0].Rows.map(row => {
        return {
          time: (new Date(row[0])).getTime(),
          value: row[2]
        };
      });

      return callback(null, _timeline);
    })
    .fail(err => {
      callback(err);
    })
  }

  liveMessages (callback) {

    var firstTimespan = 'PT24H';
    var refreshTimespan = 'PT0H10M'; // Load data from the last minute

    var poll = (timespan) => {
      $.ajax({
        method: "GET",
        url: `https://api.applicationinsights.io/beta/apps/${appInsightsAppId}/events/customEvents?timespan=${timespan}`,
        headers: {
          "x-api-key": appInsightsApiKey
        }
      })
      .then(json => {
        
        var now = moment();

        // Group custom events by 3 seconds
        var _timeline = {}; 
        json.value.forEach((cevent) => {
          if (!_messages[cevent.id]) {
            _messages[cevent.id] = cevent;

            // updating new events in conversation data
            var cd = cevent.customDimensions;
            switch (cd.name) {
              case "message.send":
              case "message.received":
                this.collectTalk(cevent);
                break;
              case "message.intent.received":
                this.collectIntents(cevent);
                break;
              default:
                this.collectActivity(now, cevent, _timeline);
                break;
            }
          }
        });

        return callback(null, _.values(_timeline), _.values(_activity));
      })
      .fail(err => {
        callback(err);
      })
    };

    // Refresh data every minute
    setInterval(() => poll(refreshTimespan), 60 * 1000);
    poll(firstTimespan);
  }

  // liveConversation2 (conversationId, callback) {
  //   var firstTimespan = 'PT24H';
  //   var pollTimespan = 'PT1H'; //'PT5M'
    
  //   var poll = (timespan) => {

  //     if (!_liveConversations[conversationId]) {
  //       _liveConversations[conversationId] = {
  //         conversationId: conversationId,
  //         messages: []
  //       };
  //     }

  //     var filter = `(customDimensions.conversationId eq '${conversationId}'` +
  //             ` and (customEvent.name eq 'MSGRCVVAL'` +
  //             ` or   customEvent.name eq 'MSGSNDVAL'))`

  //     var orderby = 'customDimensions.timestamp';

  //     filter = encodeURIComponent(filter).replace(/\./g, '%2F')
  //         .replace('MSGRCVVAL', 'message.receive')
  //         .replace('MSGSNDVAL', 'message.send');
  //     orderby = encodeURIComponent(orderby).replace(/\./g, '%2F');

  //     $.ajax({
  //         method: "GET",
  //         url: `${appInsightsUri}/apps/${appInsightsAppId}/events/customEvents?timespan=${timespan}&$filter=${filter}&$orderby=${orderby}`,
  //         headers: {
  //           "x-api-key": appInsightsApiKey
  //         }
  //       })
  //       .then(json => {

  //         var conversation = _liveConversations[conversationId];
  //         var messages = conversation.messages;
  //         var lastMessage = messages[messages.length - 1];
  //         var insertAll = !lastMessage;

  //         // Group custom events by 3 seconds
  //         json.value.forEach((cevent) => {

  //           // updating new events in conversation data
  //           var message = cevent.customDimensions;
  //           message.name = cevent.customEvent.name;

  //           if (insertAll) {
  //             messages.push(message);
  //           } else {
  //             var eventTimestamp = moment(message.timestamp);
  //             var timediff = eventTimestamp.diff(lastMessage.timestamp);
  //             if (timediff > 0 || (timediff == 0 && message.text !== lastMessage.text)) {
  //               messages.push(message);
  //               insertAll = true;
  //             }
  //           }
  //         });

  //         setTimeout(() => { return poll(pollTimespan); }, conversation.poll);

  //         return callback(null, messages);
  //       })
  //       .fail(err => {
  //         callback(err);
  //       });
  //   };

  //   poll(firstTimespan);
  // }

  _liveConversations = {};
  pollInterval = 3000;
  liveConversation (conversationId, handler) {

    this._liveConversations[conversationId] = true;
    var poll = () => {

      if (this._liveConversations[conversationId]) {
        setTimeout(() => { return poll(); }, this.pollInterval);
      }

      var conversation = this._talk[conversationId];
      if (!conversation) { return handler(null, []); }

      conversation.messages = _.orderBy(conversation.messages, "timestamp");
      handler(null, conversation.messages);
    };

    poll();
  }

  stopPolling (id) {
    if (!id) {
      for (var conv in this._liveConversations) {
        if (typeof this._liveConversations[conv] === 'boolean') {
          this._liveConversations[conv] = false;
        }
      }
    } else if (this._liveConversations[id]) {
      this._liveConversations[id] = false;
    }
  }
}

export default new ChartsData();