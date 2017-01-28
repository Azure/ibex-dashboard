var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var PieData_1 = require("./PieData");
var Timespan_1 = require("../Dashboard/Timespan");
var TimespanActions_1 = require("../../actions/TimespanActions");
var actions_common_1 = require("../../actions/actions-common");
var generic_1 = require("../../generic");
var graphs = [
    {
        id: 'graph1',
        title: 'Users',
        store: 'TimelineStore',
        data: 'data',
        lines: 'channels',
        type: 'timeline'
    }
];
var queries = [
    {
        id: 'timespan',
        type: 'calculated',
        values: ['24 hours', '1 week', '1 month'],
        selectedValue: '24 hours'
    },
    {
        id: 'conversionRate',
        type: 'app-insights',
        dependencies: ['timespan'],
        query: " customEvents" +
            " | extend successful=customDimensions.successful" +
            " | where name startswith 'message.convert'" +
            " | summarize event_count=count() by name, tostring(successful)",
        mappings: [
            { key: 'name' },
            { key: 'successful', val: function (val) { return val === 'true'; } },
            { key: 'event_count', def: 0 }
        ]
    },
    {
        id: 'timelineMessages',
        type: 'app-insights',
        dependencies: ['timespan'],
        query: function (state, timespan) {
            var granularity = actions_common_1.default.timespanToGranularity(timespan);
            return " customEvents" +
                " | where name == 'Activity'" +
                (" | summarize event_count=count() by bin(timestamp, " + granularity + "), name, tostring(customDimensions.channel)") +
                " | order by timestamp asc ";
        },
        mappings: [
            { key: 'timestamp' },
            { key: 'name' },
            { key: 'channel' },
            { key: 'event_count', def: 0 }
        ]
    },
    {
        id: 'channels',
        type: 'calculated',
        dependencies: ['timelineMessages'],
        values: function (state, data) {
            var channels = {};
            data.forEach(function (row) {
                if (!channels[row.channel])
                    channels[row.channel] = { name: row.channel, value: 0 };
                channels[row.channel].value += row.count;
            });
            return Object.keys(channels);
        }
    }
];
var Dashboard = (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard(props) {
        var _this = _super.call(this, props) || this;
        _this.dataSource1 = null;
        _this.dataSource2 = null;
        TimespanActions_1.default.update24Hours();
        _this.dataSource1 = generic_1.PipeComponent.createDataSource({
            id: 'timespan',
            type: 'Constant',
            params: {
                values: ['24 hours', '1 week', '1 month'],
                selectedValue: '1 month'
            }
        });
        _this.dataSource2 = generic_1.PipeComponent.createDataSource({
            id: 'conversions',
            type: 'ApplicationInsights/Query',
            dependencies: ['timespan'],
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
        });
        return _this;
    }
    Dashboard.prototype.componentDidMount = function () {
        var _this = this;
        this.dataSource1.store.listen(function (state) {
            _this.dataSource2.action.updateDependencies(state);
        });
        this.dataSource1.action.initialize();
    };
    Dashboard.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Timespan_1.default, null),
            React.createElement(PieData_1.default, { store: this.dataSource2.store })));
    };
    return Dashboard;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
