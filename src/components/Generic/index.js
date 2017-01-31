var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var _ = require("lodash");
var generic_1 = require("../../generic");
// var queries = [{
//     id: 'timespan',
//     type: 'calculated',
//     values: ['24 hours', '1 week', '1 month'],
//     selectedValue: '24 hours'
//   },
//   {
//     id: 'conversionRate',
//     type: 'app-insights',
//     dependencies: ['timespan'],
//     query: ` customEvents` +
//       ` | extend successful=customDimensions.successful` +
//       ` | where name startswith 'message.convert'` +
//       ` | summarize event_count=count() by name, tostring(successful)`,
//     mappings: [{
//         key: 'name'
//       },
//       {
//         key: 'successful',
//         val: (val) => val === 'true'
//       },
//       {
//         key: 'event_count',
//         def: 0
//       }
//     ]
//   },
//   {
//     id: 'timelineMessages',
//     type: 'app-insights',
//     dependencies: ['timespan'],
//     query: (state, timespan) => {
//       var granularity = common.timespanToGranularity(timespan);
//       return ` customEvents` +
//         ` | where name == 'Activity'` +
//         ` | summarize event_count=count() by bin(timestamp, ${granularity}), name, tostring(customDimensions.channel)` +
//         ` | order by timestamp asc `
//     },
//     mappings: [{
//         key: 'timestamp'
//       },
//       {
//         key: 'name'
//       },
//       {
//         key: 'channel'
//       },
//       {
//         key: 'event_count',
//         def: 0
//       }
//     ]
//   },
//   {
//     id: 'channels',
//     type: 'calculated',
//     dependencies: ['timelineMessages'],
//     values: (state, data) => {
//       var channels = {};
//       data.forEach(row => {
//         if (!channels[row.channel]) channels[row.channel] = {
//           name: row.channel,
//           value: 0
//         };
//         channels[row.channel].value += row.count;
//       });
//       return Object.keys(channels);
//     }
//   }
// ];
var dashboard = {
    dataSources: [{
            id: 'timespan',
            type: 'Constant',
            params: {
                values: ['24 hours', '1 week', '1 month'],
                selectedValue: '1 month'
            },
            calculated: function (state, dependencies) {
                var queryTimespan = state.selectedValue === '24 hours' ? 'PT24H' : state.selectedValue === '1 week' ? 'P7D' : 'P30D';
                var granularity = state.selectedValue === '24 hours' ? '1h' : state.selectedValue === '1 week' ? '1d' : '1d';
                return { queryTimespan: queryTimespan, granularity: granularity };
            }
        },
        {
            id: 'conversions',
            type: 'ApplicationInsights/Query',
            dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
            params: {
                query: " customEvents" +
                    " | extend successful=customDimensions.successful" +
                    " | where name startswith 'message.convert'" +
                    " | summarize event_count=count() by name, tostring(successful)",
                mappings: [
                    { key: 'name' },
                    { key: 'successful', val: function (val) { return val === 'true'; } },
                    { key: 'event_count', def: 0 }
                ]
            }
        },
        {
            id: 'timeline',
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
            calculated: function (state) {
                var _timeline = {};
                var _channels = {};
                var json = state.selectedValue;
                var timespan = state.timespan;
                json.Tables[0].Rows.forEach(function (row) {
                    var channel = row[2] || 'unknown';
                    var time = (new Date(row[0])).getTime();
                    var count = row[3];
                    if (!_timeline[time])
                        _timeline[time] = { time: (new Date(row[0])).toUTCString() };
                    if (!_channels[channel])
                        _channels[channel] = { name: channel, value: 0 };
                    _timeline[time][channel] = count;
                    _channels[channel].value += count;
                });
                var channels = Object.keys(_channels);
                var channelUsage = _.values(_channels);
                var timeline = _.map(_timeline, function (value) {
                    channels.forEach(function (channel) {
                        if (!value[channel])
                            value[channel] = 0;
                    });
                    return value;
                });
                return { graphData: timeline, channelUsage: channelUsage, channels: channels, timeFormat: (timespan === "24 hours" ? 'hour' : 'date') };
            }
        }
    ],
    elements: [{
            type: 'TextFilter',
            dependencies: { selectedValue: 'timespan', values: 'timespan:values' },
            actions: { changeSelected: 'timespan:updateSelectedValue' }
        },
        {
            type: 'PieData',
            dependencies: { values: 'conversions' },
            actions: {}
        },
        {
            type: 'Timeline',
            dependencies: { values: 'timeline:graphData', lines: 'timeline:channels', timeFormat: 'timeline:timeFormat' },
            actions: {}
        }
    ]
};
var Dashboard = (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard(props) {
        var _this = _super.call(this, props) || this;
        _this.dataSources = {};
        dashboard.dataSources.forEach(function (source) {
            var dataSource = generic_1.PipeComponent.createDataSource(source);
            _this.dataSources[dataSource.id] = dataSource;
        });
        return _this;
    }
    Dashboard.prototype.componentDidMount = function () {
        var _this = this;
        // Connect sources and dependencies
        var sources = Object.keys(this.dataSources);
        sources.forEach(function (sourceId) {
            var source = _this.dataSources[sourceId];
            source.store.listen(function (state) {
                sources.forEach(function (compId) {
                    var compSource = _this.dataSources[compId];
                    if (compSource.plugin.getDependencies()[sourceId]) {
                        compSource.action.updateDependencies.defer(state);
                    }
                });
            });
        });
        // Call initalize methods
        sources.forEach(function (sourceId) {
            var source = _this.dataSources[sourceId];
            if (typeof source.action['initialize'] === 'function') {
                source.action.initialize();
            }
        });
    };
    Dashboard.prototype.render = function () {
        var elements = [];
        dashboard.elements.forEach(function (element, idx) {
            var ReactElement = require('./' + element.type)['default'];
            elements.push(React.createElement(ReactElement, { key: idx, dependencies: element.dependencies, actions: element.actions }));
        });
        return (React.createElement("div", null, elements));
    };
    return Dashboard;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
