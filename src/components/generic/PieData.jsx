var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var GenericComponent_1 = require("./GenericComponent");
var Card_1 = require("../Card");
var recharts_1 = require("recharts");
var styles_1 = require("../styles");
var colors = styles_1.default.colors;
var ThemeColors = colors.ThemeColors;
;
var PieData = (function (_super) {
    __extends(PieData, _super);
    function PieData(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            activeIndex: 0,
            values: null
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
            return (<g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{name}</text>
        <recharts_1.Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
        <recharts_1.Sector cx={c.cx} cy={c.cy} startAngle={300} endAngle={60} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill}/>
        <path d={"M" + c.sx + "," + c.sy + "L" + c.mx + "," + c.my + "L" + c.ex + "," + c.ey} stroke={fill} fill="none"/>
        <circle cx={c.ex} cy={c.ey} r={2} fill={fill} stroke="none"/>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} textAnchor={c.textAnchor} fill="#333">{value + " " + type.toLowerCase()}</text>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} dy={18} textAnchor={c.textAnchor} fill="#999">
          {"(Rate " + (percent * 100).toFixed(2) + "%)"}
        </text>
      </g>);
        };
        _this.onPieEnter = _this.onPieEnter.bind(_this);
        return _this;
    }
    PieData.prototype.onPieEnter = function (data, index) {
        this.setState({ activeIndex: index });
    };
    PieData.prototype.render = function () {
        var values = this.state.values;
        var _a = this.props, props = _a.props, layout = _a.layout;
        var pieProps = props.pieProps, showLegend = props.showLegend, width = props.width, height = props.height;
        if (!values) {
            return null;
        }
        // Todo: Receive the width of the SVG component from the container
        return (<Card_1.default title="Conversion Usage" subtitle={"Conversion Rate"}>
        <recharts_1.ResponsiveContainer>
          <recharts_1.PieChart>
            <recharts_1.Pie data={values} cx={Math.min(layout.h / 4, layout.w) * 60} innerRadius={60} fill="#8884d8" onMouseEnter={this.onPieEnter} activeIndex={this.state.activeIndex} activeShape={this.renderActiveShape.bind(this)} paddingAngle={0} {...pieProps}>
              {values.map(function (entry, index) { return <recharts_1.Cell key={index} fill={ThemeColors[index % ThemeColors.length]}/>; })}
              <recharts_1.Cell key={0} fill={colors.GoodColor}/>
              <recharts_1.Cell key={1} fill={colors.BadColor}/>
            </recharts_1.Pie>
            {showLegend !== false && <recharts_1.Legend layout="vertical" align="right" verticalAlign="top"/>}
          </recharts_1.PieChart>
        </recharts_1.ResponsiveContainer>
      </Card_1.default>);
    };
    return PieData;
}(GenericComponent_1.GenericComponent));
exports.default = PieData;
