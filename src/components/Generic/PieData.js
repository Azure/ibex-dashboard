var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var GenericComponent_1 = require("./GenericComponent");
var Card_1 = require("material-ui/Card");
var recharts_1 = require("recharts");
var styles_1 = require("../styles");
var colors = styles_1.default.colors;
var ThemeColors = colors.ThemeColors;
;
;
var PieData = (function (_super) {
    __extends(PieData, _super);
    function PieData(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            activeIndex: 0
        };
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
                React.createElement("text", { x: cx, y: cy, dy: 8, textAnchor: "middle", fill: fill }, name),
                React.createElement(recharts_1.Sector, { cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, startAngle: startAngle, endAngle: endAngle, fill: fill }),
                React.createElement(recharts_1.Sector, { cx: c.cx, cy: c.cy, startAngle: 300, endAngle: 60, innerRadius: outerRadius + 6, outerRadius: outerRadius + 10, fill: fill }),
                React.createElement("path", { d: "M" + c.sx + "," + c.sy + "L" + c.mx + "," + c.my + "L" + c.ex + "," + c.ey, stroke: fill, fill: "none" }),
                React.createElement("circle", { cx: c.ex, cy: c.ey, r: 2, fill: fill, stroke: "none" }),
                React.createElement("text", { x: c.ex + (c.cos >= 0 ? 1 : -1) * 12, y: c.ey, textAnchor: c.textAnchor, fill: "#333" }, value + " " + type.toLowerCase()),
                React.createElement("text", { x: c.ex + (c.cos >= 0 ? 1 : -1) * 12, y: c.ey, dy: 18, textAnchor: c.textAnchor, fill: "#999" }, "(Rate " + (percent * 100).toFixed(2) + "%)")));
        };
        _this.onPieEnter = _this.onPieEnter.bind(_this);
        return _this;
    }
    PieData.prototype.onPieEnter = function (data, index) {
        this.setState({ activeIndex: index });
    };
    PieData.prototype.render = function () {
        var values = this.state.values;
        var _a = this.props.props, pieProps = _a.pieProps, showLegend = _a.showLegend, width = _a.width, height = _a.height;
        if (!values) {
            return null;
        }
        // Todo: Receive the width of the SVG component from the container
        return (React.createElement(Card_1.Card, { className: 'dash-card' },
            React.createElement(Card_1.CardHeader, { className: 'card-header', title: "Conversion Usage", subtitle: "Conversion Rate" }),
            React.createElement(Card_1.CardMedia, { style: styles_1.default.cards.cardMediaStyle },
                React.createElement(recharts_1.ResponsiveContainer, null,
                    React.createElement(recharts_1.PieChart, { width: width || 500, height: height || 240 },
                        React.createElement(recharts_1.Pie, __assign({ data: values, cx: 120, cy: 120, innerRadius: 60, outerRadius: 80, fill: "#8884d8", onMouseEnter: this.onPieEnter, activeIndex: this.state.activeIndex, activeShape: this.renderActiveShape.bind(this), paddingAngle: 0 }, pieProps),
                            values.map(function (entry, index) { return React.createElement(recharts_1.Cell, { key: index, fill: ThemeColors[index % ThemeColors.length] }); }),
                            React.createElement(recharts_1.Cell, { key: 0, fill: colors.GoodColor }),
                            React.createElement(recharts_1.Cell, { key: 1, fill: colors.BadColor })),
                        showLegend !== false && React.createElement(recharts_1.Legend, { layout: "vertical", align: "right", verticalAlign: "top" }))))));
    };
    return PieData;
}(GenericComponent_1.GenericComponent));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PieData;
