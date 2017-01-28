var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Card_1 = require("material-ui/Card");
var recharts_1 = require("recharts");
var _ = require("lodash");
var colors_1 = require("../Dashboard/colors");
var styles_1 = require("../Dashboard/styles");
var ThemeColors = colors_1.default.ThemeColors;
;
;
var PieData = (function (_super) {
    __extends(PieData, _super);
    function PieData(props) {
        var _this = _super.call(this, props) || this;
        _this.renderActiveShape = function (props) {
            var mode = _this.props.mode;
            var type = mode === 'users' ? 'Users' : 'Messages';
            var RADIAN = Math.PI / 180;
            var name = props.name, cx = props.cx, cy = props.cy, midAngle = props.midAngle, innerRadius = props.innerRadius, outerRadius = props.outerRadius, startAngle = props.startAngle, endAngle = props.endAngle, fill = props.fill, payload = props.payload, percent = props.percent, value = props.value;
            var sin = Math.sin(-RADIAN * midAngle);
            var cos = Math.cos(-RADIAN * midAngle);
            var sx = cx + (outerRadius + 10) * cos;
            var sy = cy + (outerRadius + 10) * sin;
            var mx = cx + (outerRadius + 30) * cos;
            var my = cy + (outerRadius + 30) * sin;
            var ex = mx + (cos >= 0 ? 1 : -1) * 22;
            var ey = my;
            var textAnchor = cos >= 0 ? 'start' : 'end';
            var c = {};
            c.midAngle = 54.11764705882353;
            c.sin = Math.sin(-RADIAN * c.midAngle);
            c.cos = Math.cos(-RADIAN * c.midAngle);
            c.cx = cx;
            c.cy = cy;
            c.sx = cx + (outerRadius + 10) * c.cos;
            c.sy = cy + (outerRadius + 10) * c.sin;
            c.mx = cx + (outerRadius + 30) * c.cos;
            c.my = cy + (outerRadius + 30) * c.sin;
            c.ex = c.mx + (c.cos >= 0 ? 1 : -1) * 22;
            c.ey = c.my;
            c.textAnchor = 'start';
            return (React.createElement("g", null,
                React.createElement("text", { x: cx, y: cy, dy: 8, textAnchor: "middle", fill: fill }, payload.name),
                React.createElement(recharts_1.Sector, { cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, startAngle: startAngle, endAngle: endAngle, fill: fill }),
                React.createElement(recharts_1.Sector, { cx: c.cx, cy: c.cy, startAngle: 300, endAngle: 60, innerRadius: outerRadius + 6, outerRadius: outerRadius + 10, fill: fill }),
                React.createElement("path", { d: "M" + c.sx + "," + c.sy + "L" + c.mx + "," + c.my + "L" + c.ex + "," + c.ey, stroke: fill, fill: "none" }),
                React.createElement("circle", { cx: c.ex, cy: c.ey, r: 2, fill: fill, stroke: "none" }),
                React.createElement("text", { x: c.ex + (c.cos >= 0 ? 1 : -1) * 12, y: c.ey, textAnchor: c.textAnchor, fill: "#333" }, value + " " + type.toLowerCase()),
                React.createElement("text", { x: c.ex + (c.cos >= 0 ? 1 : -1) * 12, y: c.ey, dy: 18, textAnchor: c.textAnchor, fill: "#999" }, "(Rate " + (percent * 100).toFixed(2) + "%)")));
        };
        _this.onChange = _this.onChange.bind(_this);
        _this.state = props.store.getState();
        return _this;
    }
    PieData.prototype.componentDidMount = function () {
        this.props.store.listen(this.onChange);
    };
    PieData.prototype.componentWillUnmount = function () {
        this.props.store.unlisten(this.onChange);
    };
    PieData.prototype.onChange = function (state) {
        this.setState(state);
    };
    PieData.prototype.render = function () {
        var conversions = this.state.conversions;
        var total = _.find(conversions, { name: 'message.convert.start' });
        var successful = _.find(conversions, { name: 'message.convert.end', successful: true }) || { event_count: 0 };
        if (!total) {
            return null;
        }
        var values = [
            { name: 'Successful', value: successful.event_count },
            { name: 'Failed', value: total.event_count - successful.event_count },
        ];
        // Todo: Receive the width of the SVG component from the container
        return (React.createElement(Card_1.Card, { className: 'dash-card' },
            React.createElement(Card_1.CardHeader, { className: 'card-header', title: "Conversion Usage", subtitle: "Conversion Rate" }),
            React.createElement(Card_1.CardMedia, { style: styles_1.default.cardMediaStyle },
                React.createElement(recharts_1.PieChart, { width: 500, height: 240 },
                    React.createElement(recharts_1.Pie, { data: values, cx: 270, cy: 120, innerRadius: 60, outerRadius: 80, fill: "#8884d8", activeIndex: 0, activeShape: this.renderActiveShape.bind(this), paddingAngle: 0 },
                        React.createElement(recharts_1.Cell, { key: 0, fill: colors_1.default.GoodColor }),
                        React.createElement(recharts_1.Cell, { key: 1, fill: colors_1.default.BadColor })),
                    React.createElement(recharts_1.Legend, { wrapperStyle: { marginLeft: 70 } })))));
    };
    return PieData;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PieData;
