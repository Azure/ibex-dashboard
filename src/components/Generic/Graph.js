var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Card_1 = require("material-ui/Card");
var recharts_1 = require("recharts");
var moment = require("moment");
var colors_1 = require("../Dashboard/colors");
var styles_1 = require("../Dashboard/styles");
var ThemeColors = colors_1.default.ThemeColors;
;
;
var Graph = (function (_super) {
    __extends(Graph, _super);
    function Graph(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = _this.onChange.bind(_this);
        _this.state = props.store.getState();
        return _this;
    }
    Graph.prototype.componentDidMount = function () {
        this.props.store.listen(this.onChange);
    };
    Graph.prototype.componentWillUnmount = function () {
        this.props.store.unlisten(this.onChange);
    };
    Graph.prototype.onChange = function (state) {
        this.setState(state);
    };
    Graph.prototype.dateFormat = function (time) {
        return moment(time).format('MMM-DD');
    };
    Graph.prototype.hourFormat = function (time) {
        return moment(time).format('HH:mm');
    };
    Graph.prototype.render = function () {
        var data = this.state[this.props.data || 'data'] || [];
        var lines = this.state[this.props.lines || 'lines'] || [];
        var format = this.state.timespan === "24 hours" ? this.hourFormat : this.dateFormat;
        var glines = [];
        if (data && data.length) {
            glines = lines.map(function (line, idx) {
                return React.createElement(recharts_1.Line, { key: idx, type: "monotone", dataKey: line, stroke: ThemeColors[idx], dot: false, ticksCount: 5 });
            });
        }
        return (React.createElement(Card_1.Card, { className: 'dash-card' },
            React.createElement(Card_1.CardHeader, { className: 'card-header', title: 'Users', subtitle: "How many messages were send in each channel" }),
            React.createElement(Card_1.CardMedia, { style: styles_1.default.cardMediaStyle },
                React.createElement(recharts_1.ResponsiveContainer, null,
                    React.createElement(recharts_1.LineChart, { data: data, margin: { top: 5, right: 30, left: 20, bottom: 5 } },
                        React.createElement(recharts_1.XAxis, { dataKey: "time", tickFormatter: format, minTickGap: 20 }),
                        React.createElement(recharts_1.YAxis, null),
                        React.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(recharts_1.Tooltip, null),
                        React.createElement(recharts_1.Legend, null),
                        glines)))));
    };
    return Graph;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Graph;
