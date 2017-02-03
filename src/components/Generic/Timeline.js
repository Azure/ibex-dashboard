var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var GenericComponent_1 = require("./GenericComponent");
var moment = require("moment");
var recharts_1 = require("recharts");
var Card_1 = require("material-ui/Card");
var styles_1 = require("../styles");
var Timeline = (function (_super) {
    __extends(Timeline, _super);
    function Timeline() {
        return _super.apply(this, arguments) || this;
    }
    // static propTypes = {}
    // static defaultProps = {}
    Timeline.prototype.dateFormat = function (time) {
        return moment(time).format('MMM-DD');
    };
    Timeline.prototype.hourFormat = function (time) {
        return moment(time).format('HH:mm');
    };
    Timeline.prototype.render = function () {
        var _a = this.state, timeFormat = _a.timeFormat, values = _a.values, lines = _a.lines;
        var format = timeFormat === "hour" ? this.hourFormat : this.dateFormat;
        var lineElements = [];
        if (values && values.length && lines) {
            lineElements = lines.map(function (line, idx) {
                return React.createElement(recharts_1.Line, { key: idx, type: "monotone", dataKey: line, dot: false, ticksCount: 5 });
            });
        }
        return (React.createElement(Card_1.Card, { className: 'dash-card' },
            React.createElement(Card_1.CardHeader, { className: 'card-header', title: 'Channel Usage', subtitle: "How many messages were send in each channel" }),
            React.createElement(Card_1.CardMedia, { style: styles_1.default.cards.cardMediaStyle },
                React.createElement(recharts_1.ResponsiveContainer, null,
                    React.createElement(recharts_1.LineChart, { data: values, margin: { top: 5, right: 30, left: 20, bottom: 5 } },
                        React.createElement(recharts_1.XAxis, { dataKey: "time", tickFormatter: format, minTickGap: 20 }),
                        React.createElement(recharts_1.YAxis, { type: "number", domain: ['dataMin', 'dataMax'] }),
                        React.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                        React.createElement(recharts_1.Tooltip, null),
                        React.createElement(recharts_1.Legend, null),
                        lineElements)))));
    };
    return Timeline;
}(GenericComponent_1.GenericComponent));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Timeline;
