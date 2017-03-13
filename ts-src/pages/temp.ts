import * as _ from 'lodash';

export default {
  dataSources: [{
      id: 'timespan',
      type: 'Constant',
      params: {
        values: ['24 hours', '1 week', '1 month'],
        selectedValue: '1 month'
      },
      calculated: (state, dependencies) => {
        var queryTimespan = state.selectedValue === '24 hours' ? 'PT24H' : state.selectedValue === '1 week' ? 'P7D' : 'P30D';
        var granularity = state.selectedValue === '24 hours' ? '5m' : state.selectedValue === '1 week' ? '1d' : '1d';

        return { queryTimespan, granularity };
      }
    },
    {
      id: 'conversions',
      type: 'ApplicationInsights/Query',
      dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
      params: {
        query: ` customEvents` +
          ` | extend successful=customDimensions.successful` +
          ` | where name startswith 'message.convert'` +
          ` | summarize event_count=count() by name, tostring(successful)`,
        mappings: [
          { key: 'name' },
          { key: 'successful', val: (val) => val === 'true' },
          { key: 'event_count', def: 0 }
        ]
      },
      calculated: (state) => {
        var { values } = state;

        var total : any = _.find(values, { name: 'message.convert.start' });
        var successful: any = _.find(values, { name: 'message.convert.end', successful: true }) || { event_count: 0 };

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
      id: 'timeline',
      type: 'ApplicationInsights/Query',
      dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan', granularity: 'timespan:granularity' },
      params: {
        query: (dependencies) => {
          var { granularity } = dependencies;
          return ` customEvents` +
                   ` | where name == 'Activity'` + 
                   ` | summarize event_count=count() by bin(timestamp, ${granularity}), name, tostring(customDimensions.channel)` +
                   ` | order by timestamp asc `
        },
        mappings: [
          { key: 'time' },
          { key: '__' },
          { key: 'channel', def: 'unknown' },
          { key: 'count', def: 0 }
        ]
      },
      calculated: (state) => {
        var _timeline = {};
        var _channels = {};
        var values = state.values || [];
        var timespan = state.timespan;

        values.forEach(row => {
          var { channel, time, count } = row;
          var timeValue = (new Date(time)).getTime();
          
          if (!_timeline[timeValue]) _timeline[timeValue] = { time: (new Date(time)).toUTCString() };
          if (!_channels[channel]) _channels[channel] = { name: channel, value: 0 };

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

        return { graphData: timeline, channelUsage, channels, timeFormat: (timespan === "24 hours" ? 'hour' : 'date') };
      }
    }/*,
    {
      id: 'timeline2',
      type: 'Constant',
      dependencies: { timespan: 'timespan' },
      params: {
        value: [],
        selectedValue: {
          "Tables": [{
            "TableName": "Table_0",
            "Columns": [{
              "ColumnName": "timestamp",
              "DataType": "DateTime",
              "ColumnType": "datetime"
            }, {
              "ColumnName": "name",
              "DataType": "String",
              "ColumnType": "string"
            }, {
              "ColumnName": "customDimensions_channel",
              "DataType": "String",
              "ColumnType": "string"
            }, {
              "ColumnName": "event_count",
              "DataType": "Int64",
              "ColumnType": "long"
            }],
            "Rows": [
              ["2017-01-09T00:00:00Z", "Activity", "webchat", 38],
              ["2017-01-11T00:00:00Z", "Activity", "webchat", 8],
              ["2017-01-12T00:00:00Z", "Activity", "webchat", 14],
              ["2017-01-15T00:00:00Z", "Activity", "webchat", 15],
              ["2017-01-22T00:00:00Z", "Activity", "webchat", 3],
              ["2017-01-23T00:00:00Z", "Activity", "webchat", 6],
              ["2017-01-25T00:00:00Z", "Activity", "webchat", 1]
            ]
          }, {
            "TableName": "Table_1",
            "Columns": [{
              "ColumnName": "Value",
              "DataType": "String",
              "ColumnType": "string"
            }],
            "Rows": [
              ["{\"Visualization\":\"table\",\"Title\":\"\",\"Accumulate\":false,\"IsQuerySorted\":true,\"Kind\":\"\",\"Annotation\":\"\",\"By\":null}"]
            ]
          }, {
            "TableName": "Table_2",
            "Columns": [{
              "ColumnName": "Timestamp",
              "DataType": "DateTime",
              "ColumnType": "datetime"
            }, {
              "ColumnName": "Severity",
              "DataType": "Int32",
              "ColumnType": "int"
            }, {
              "ColumnName": "SeverityName",
              "DataType": "String",
              "ColumnType": "string"
            }, {
              "ColumnName": "StatusCode",
              "DataType": "Int32",
              "ColumnType": "int"
            }, {
              "ColumnName": "StatusDescription",
              "DataType": "String",
              "ColumnType": "string"
            }, {
              "ColumnName": "Count",
              "DataType": "Int32",
              "ColumnType": "int"
            }, {
              "ColumnName": "RequestId",
              "DataType": "Guid",
              "ColumnType": "guid"
            }, {
              "ColumnName": "ActivityId",
              "DataType": "Guid",
              "ColumnType": "guid"
            }, {
              "ColumnName": "SubActivityId",
              "DataType": "Guid",
              "ColumnType": "guid"
            }, {
              "ColumnName": "ClientActivityId",
              "DataType": "String",
              "ColumnType": "string"
            }],
            "Rows": [
              ["2017-01-29T17:23:02.834179Z", 4, "Info", 0, "Query completed successfully", 1, "f30e2fae-b8e7-4f9c-9d44-bd1e9f4be69d", "f30e2fae-b8e7-4f9c-9d44-bd1e9f4be69d", "a268366a-1c86-4838-9043-620cb33c19d8", "e99b48a2-7377-4570-8841-aa3681bd3da2"],
              ["2017-01-29T17:23:02.834179Z", 6, "Stats", 0, "{\"ExecutionTime\":0.2187808,\"resource_usage\":{\"cache\":{\"memory\":{\"hits\":38071,\"misses\":30,\"total\":38101},\"disk\":{\"hits\":22,\"misses\":0,\"total\":22}},\"cpu\":{\"user\":\"00:00:08.3593750\",\"kernel\":\"00:00:00.0781250\",\"total cpu\":\"00:00:08.4375000\"},\"memory\":{\"peak_per_node\":268437088}}}", 1, "f30e2fae-b8e7-4f9c-9d44-bd1e9f4be69d", "f30e2fae-b8e7-4f9c-9d44-bd1e9f4be69d", "a268366a-1c86-4838-9043-620cb33c19d8", "e99b48a2-7377-4570-8841-aa3681bd3da2"]
            ]
          }, {
            "TableName": "Table_3",
            "Columns": [{
              "ColumnName": "Ordinal",
              "DataType": "Int64",
              "ColumnType": "long"
            }, {
              "ColumnName": "Kind",
              "DataType": "String",
              "ColumnType": "string"
            }, {
              "ColumnName": "Name",
              "DataType": "String",
              "ColumnType": "string"
            }, {
              "ColumnName": "Id",
              "DataType": "String",
              "ColumnType": "string"
            }],
            "Rows": [
              [0, "QueryResult", "PrimaryResult", "a3cb2fea-26b6-4bf3-ab0e-9d7e93ce9afe"],
              [1, "QueryResult", "@ExtendedProperties", "664acaec-2a9f-4501-9d5c-6a60c8acb86d"],
              [2, "QueryStatus", "QueryStatus", "00000000-0000-0000-0000-000000000000"]
            ]
          }]
        }
      },
      calculated: (state) => {
        var _timeline = {};
        var _channels = {};
        var json = state.selectedValue;
        var timespan = state.timespan;

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

        return { graphData: timeline, channelUsage, channels, timeFormat: (timespan === "24 hours" ? 'hour' : 'date') };
      }
    }*/
  ],
  filters: [
    {
      type: 'TextFilter',
      dependencies: { selectedValue: 'timespan', values: 'timespan:values' },
      actions: { changeSelected: 'timespan:updateSelectedValue' },
      first: true
    }
  ],
  elements: [
    {
      id: 'conversions',
      type: 'PieData',
      title: 'Conversion Rate',
      subtitle: 'Total conversion rate',
      dependencies: { values: 'conversions:displayValues' },
      props: { 
        pieProps: { nameKey: 'label', valueKey: 'count' }
      },
      actions: { }
    },
    {
      id: 'channels',
      type: 'PieData',
      title: 'Channel Usage',
      subtitle: 'Total messages sent per channel',
      dependencies: { values: 'timeline:channelUsage' },
      props: {
        width: 400,
        showLegend: false
      },
      actions: {}
    },
    {
      id: 'timeline',
      type: 'Timeline',
      title: 'Message Rate',
      subtitle: 'How many messages were sent per timeframe',
      dependencies: { values: 'timeline:graphData', lines: 'timeline:channels', timeFormat: 'timeline:timeFormat' },
      props: { },
      actions: { }
    },
    {
      id: 'intents',
      type: 'Scatter',
      title: 'Intents Graph',
      subtitle: 'Intents usage per time',
      dependencies: { values: 'timeline:graphData', lines: 'timeline:channels', timeFormat: 'timeline:timeFormat' },
      props: { },
      actions: { }
    }
  ]
};