Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const Card_1 = require("../Card");
const recharts_1 = require("recharts");
const styles_1 = require("../styles");
var colors = styles_1.default.colors;
var { ThemeColors } = colors;
;
class PieData extends GenericComponent_1.GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            values: null
        };
        this.renderActiveShape = (props) => {
            const { mode } = this.props;
            var type = mode === 'users' ? 'Users' : 'Messages';
            const RADIAN = Math.PI / 180;
            const { name, cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const sx = cx + (outerRadius + 10) * cos;
            const sy = cy + (outerRadius + 10) * sin;
            const mx = cx + (outerRadius + 30) * cos;
            const my = cy + (outerRadius + 30) * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 22;
            const ey = my;
            const textAnchor = cos >= 0 ? 'start' : 'end';
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
        <path d={`M${c.sx},${c.sy}L${c.mx},${c.my}L${c.ex},${c.ey}`} stroke={fill} fill="none"/>
        <circle cx={c.ex} cy={c.ey} r={2} fill={fill} stroke="none"/>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} textAnchor={c.textAnchor} fill="#333">{`${value} ${type.toLowerCase()}`}</text>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} dy={18} textAnchor={c.textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>);
        };
        this.onPieEnter = this.onPieEnter.bind(this);
    }
    onPieEnter(data, index) {
        this.setState({ activeIndex: index });
    }
    render() {
        var { values } = this.state;
        var { props, title, subtitle, layout } = this.props;
        var { pieProps, showLegend } = props;
        if (!values) {
            return null;
        }
        // Todo: Receive the width of the SVG component from the container
        return (<Card_1.default title={title} subtitle={subtitle}>
        <recharts_1.ResponsiveContainer>
          <recharts_1.PieChart>
            <recharts_1.Pie data={values} cx={Math.min(layout.h / 4, layout.w) * 60} innerRadius={60} fill="#8884d8" onMouseEnter={this.onPieEnter} activeIndex={this.state.activeIndex} activeShape={this.renderActiveShape.bind(this)} paddingAngle={0} {...pieProps}>
              {values.map((entry, index) => <recharts_1.Cell key={index} fill={ThemeColors[index % ThemeColors.length]}/>)}
              <recharts_1.Cell key={0} fill={colors.GoodColor}/>
              <recharts_1.Cell key={1} fill={colors.BadColor}/>
            </recharts_1.Pie>
            {showLegend !== false && <recharts_1.Legend layout="vertical" align="right" verticalAlign="top"/>}
          </recharts_1.PieChart>
        </recharts_1.ResponsiveContainer>
      </Card_1.default>);
    }
}
exports.default = PieData;
