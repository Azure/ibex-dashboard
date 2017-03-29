return {
  config: {
    connections: { },
    layout: {
      isDraggable: true,
      isResizable: true,
      rowHeight: 30,
      // This turns off compaction so you can place items wherever.
      verticalCompact: false,
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}
    }
  },
  dataSources: [
    {
      id: "timespan",
      type: "Constant",
      params: {
        values: ["24 hours", "1 week", "1 month", "3 months"],
        selectedValue: "1 month"
      },
      calculated: (state, dependencies) => {
        var queryTimespan =
          state.selectedValue === '24 hours' ? 'PT24H' :
          state.selectedValue === '1 week' ? 'P7D' :
          state.selectedValue === '1 month' ? 'P30D' :
          'P90D';
        var granularity =
          state.selectedValue === '24 hours' ? '5m' :
          state.selectedValue === '1 week' ? '1d' : '1d';

        return { queryTimespan, granularity };
      }
    }, 
    {
      id: "conversions",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan" },
      params: {
        query: ` customEvents` +
            ` | extend successful=customDimensions.successful` +
            ` | where name startswith 'message.convert'` +
            ` | summarize event_count=count() by name, tostring(successful)`,
        mappings: {
          "successful": (val) => val === 'true',
          "event_count": (val) => val || 0
        }
      },
      calculated: (state) => {
        var { values } = state;

        var total = _.find(values, { name: 'message.convert.start' });
        var successful = _.find(values, { name: 'message.convert.end', successful: true }) || { event_count: 0 };

        if (!total) {
          return null;
        }

        var displayValues = [
          { label: 'Successful', count: successful.event_count },
          { label: 'Failed', count: total.event_count - successful.event_count + 5 },
        ];

        return { displayValues };
      }
    }, 
    {
      id: "timeline",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan", granularity: "timespan:granularity" },
      params: {
        query: (dependencies) => {
          var { granularity } = dependencies;
          return ` customEvents` +
            ` | where name == 'Activity'` +
            ` | summarize count=count() by bin(timestamp, ${granularity}), name, channel=tostring(customDimensions.channel)` +
            ` | order by timestamp asc `
        },
        mappings: {
          "channel": (val) => val || "unknown",
          "count": (val) => val || 0,
        }
      },
      calculated: (state) => {
        var _timeline = {};
        var _channels = {};
        var values = state.values || [];
        var timespan = state.timespan;

        values.forEach(row => {
          var { channel, timestamp, count } = row;
          var timeValue = (new Date(timestamp)).getTime();

          if (!_timeline[timeValue]) _timeline[timeValue] = {
            time: (new Date(timestamp)).toUTCString()
          };
          if (!_channels[channel]) _channels[channel] = {
            name: channel,
            value: 0
          };

          _timeline[timeValue][channel] = count;
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

        return {
          graphData: timeline,
          channelUsage,
          channels,
          timeFormat: (timespan === "24 hours" ? 'hour' : 'date')
        };
      }
    }, 
    {
      id: "errors",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan" },
      params: {
        query: ` exceptions` +
            ` | summarize count_error=count() by handledAt, innermostMessage` +
            ` | order by count_error desc `,
        mappings: {
          "handledAt": (val) => val || "Unknown",
          "count": (val, row) => row.count_error
        }
      },
      calculated: (state) => {
        var { values } = state;

        var errors = values;
        var handlers = {};
        var handledAtTotal = 0;
        var handledAtUncaught = 0;
        errors.forEach(error => {
          if (!handlers[error.handledAt]) handlers[error.handledAt] = {
            name: error.handledAt,
            count: 0
          };
          handlers[error.handledAt].count += error.count;
          handledAtTotal += error.count;
          handledAtUncaught += (error.handledAt !== 'UserCode' ? error.count : 0);
        });

        return {
          errors,
          handlers: _.values(handlers),
          handledAtTotal,
          handledAtTotal_icon: handledAtTotal > 0 ? 'bug_report' : 'done',
          handledAtTotal_class: handledAtTotal > 0 ? 'dash-error' : 'dash-success',
          handledAtUncaught
        };
      }
    }, 
    {
      id: "intents",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan" },
      params: {
        query: ` customEvents` +
          ` | extend cslen = customDimensions.callstack_length, intent=customDimensions.intent` +
          ` | where name startswith "message.intent" and (cslen == 0 or strlen(cslen) == 0) and strlen(intent) > 0` +
          ` | summarize count=count() by tostring(intent)`,
        mappings: {
          "intent": (val) => val || "Unknown",
          "count": (val) => val || 0,
        }
      },
      calculated: (state) => {
        return {
          bars: [ 'count' ]
        };
      }
    },
    {
      id: 'users',
      type: 'ApplicationInsights/Query',
      dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
      params: {
        query: ` customEvents` + 
                ` | summarize totalUsers=count() by user_Id`,
      },
      calculated: (state) => {
        var value = _.values(state);
        return {
          value: value,
          icon: 'account_circle'
        };
      }
    },
    {
      id: 'channelActivity',
      type: 'ApplicationInsights/Query',
      dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
      params: {
        query: ` customEvents` + 
                ` | where name == 'Activity'` + 
                ` | extend channel=customDimensions.channel` + 
                ` | extend hourOfDay=floor(timestamp % 1d, 1h) / 1hr` + 
                ` | extend duration=tolong(customMeasurements.duration/1000) ` + 
                ` | summarize count=count() by tolong(duration), tostring(channel), hourOfDay` + 
                ` | order by hourOfDay asc`,
        mappings: [
          { key: 'duration', def: 0 },
          { key: 'channel', def: 'unknown' },
          { key: 'hourOfDay', def: 0 },
          { key: 'count', def: 0 }
        ]
      },
      calculated: (state) => {
        var { values } = state;
        var groupedValues = _.chain(values).groupBy('channel').value();
        return {
          groupedValues: groupedValues
        };
      }
    }
  ],
  filters: [
    {
      type: "TextFilter",
      dependencies: { selectedValue: "timespan", values: "timespan:values" },
      actions: { onChange: "timespan:updateSelectedValue" },
      first: true
    }
  ],
  elements: [
    {
      id: "timeline",
      type: "Timeline",
      title: "Message Rate",
      subtitle: "How many messages were sent per timeframe",
      size: { w: 5, h: 8 },
      dependencies: { values: "timeline:graphData", lines: "timeline:channels", timeFormat: "timeline:timeFormat" }
    }, 
    {
      id: "channels",
      type: "PieData",
      title: "Channel Usage",
      subtitle: "Total messages sent per channel",
      size: { w: 3, h: 8 },
      dependencies: { values: "timeline:channelUsage" },
      props: { 
        showLegend: false 
      }
    }, 
    {
      id: "errors",
      type: "Scorecard",
      title: "Errors",
      size: { w: 2, h: 2 },
      dependencies: { value: "errors:handledAtTotal", icon: "errors:handledAtTotal_icon", className: "errors:handledAtTotal_class" }
    }, 
    {
      id: 'totalUsers',
      type: 'Scorecard',
      title: "Total users",
      size: { w: 2, h: 3},
      dependencies: { value: 'users:value', icon: 'users:icon'},
    },
    {
      id: "intents",
      type: "BarData",
      title: "Intents Graph",
      subtitle: "Intents usage per time",      
      size: { w: 4, h: 8 },
      dependencies: { values: "intents", bars: "intents:bars" },
      props: {
        nameKey: "intent"
      },
      actions: {
        onBarClick: {
          action: "dialog:conversations",
          params: {
            title: "args:intent",
            intent: "args:intent",
            queryspan: "timespan:queryTimespan"
          }
        }
      }
    }, 
    {
      id: "conversions",
      type: "PieData",
      title: "Conversion Rate",
      subtitle: "Total conversion rate",
      size: { w: 4, h: 8 },
      dependencies: { values: "conversions:displayValues" },
      props: {
        pieProps: { nameKey: "label", valueKey: "count" }
      }
    }, 
    {
      id: "timeline-area",
      type: "Area",
      title: "Message Rate",
      subtitle: "How many messages were sent per timeframe",
      size: { w: 4, h: 8 },
      dependencies: { values: "timeline:graphData", lines: "timeline:channels", timeFormat: "timeline:timeFormat" },
      props: {
        isStacked: true,
        showLegend: false
      }
    },
    {
      id: 'scatter',
      type: 'Scatter',
      title: 'Channel activity',
      subtitle: 'Monitor channel activity across time of day',
      size: { w: 4, h: 8 },
      dependencies: { groupedValues:'channelActivity:groupedValues' },
      props: {
        xDataKey: "hourOfDay",
        yDataKey: "duration",
        zDataKey: "count",
        zRange: [10,500]
      }
    }
  ],
  dialogs: [
    {
      id: "conversations",
      width: "60%",
      params: ["title", "intent", "queryspan"],
      dataSources: [{
        id: "conversations-data",
        type: "ApplicationInsights/Query",
        dependencies: { intent: "dialog_conversations:intent", queryTimespan: "dialog_conversations:queryspan" },
        params: {
          query: ({ intent }) => ` customEvents` +
            ` | extend conversation = customDimensions.conversationId, intent=customDimensions.intent` +
            ` | where name startswith "message.intent" and intent =~ '${intent}'` +
            ` | summarize count=count(), maxTimestamp=max(timestamp) by tostring(conversation)` +
            ` | order by maxTimestamp`,
          mappings: {
            "id": (val, row, idx) => `Conversation ${idx}`
          }
        }
      }],
      elements: [
        {
          id: "conversations-list",
          type: "Table",
          title: "Conversations",
          size: { w: 12, h: 16 },
          dependencies: { values: "conversations-data" },
          props: {
            cols: [{
              header: "Conversation Id",
              field: "id"
            }, {
              header: "Last Message",
              field: "maxTimestamp",
              type: "time",
              format: "MMM-DD HH:mm:ss"
            }, {
              header: "Count",
              field: "count"
            }, {
              type: "button",
              value: "chat",
              onClick: "openMessagesDialog"
            }]
          },
          actions: {
            openMessagesDialog: {
              action: "dialog:messages",
              params: {
                title: "args:id",
                conversation: "args:conversation",
                queryspan: "timespan:queryTimespan"
              }
            }
          }
        }
      ]
    },
    {
      id: "messages",
      width: "50%",
      params: ["title", "conversation", "queryspan"],
      dataSources: [
        {
          id: "messages-data",
          type: "ApplicationInsights/Query",
          dependencies: { conversation: "dialog_messages:conversation", queryTimespan: "dialog_messages:queryspan" },
          params: {
            query: ({ conversation }) => ` customEvents` +
              ` | extend conversation = customDimensions.conversationId, intent=customDimensions.intent` +
              ` | where name in ("message.send", "message.received") and conversation == '${conversation}'` +
              ` | order by timestamp asc` +
              ` | project timestamp, eventName=name, message=customDimensions.text, customDimensions.userName, customDimensions.userId`
          }
        }
      ],
      elements: [
        {
          id: "messages-list",
          type: "Table",
          title: "Messages",
          size: { w: 12, h: 16 },
          dependencies: { values: "messages-data" },
          props: {
            rowClassNameField: "eventName",
            cols: [{
              header: "Timestamp",
              width: "50px",
              field: "timestamp",
              type: "time",
              format: "MMM-DD HH:mm:ss"
            }, {
              header: "Message",
              field: "message"
            }]
          }
        }
      ]
    }
  ]
}