Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const Card_1 = require("../Card");
const recharts_1 = require("recharts");
const styles_1 = require("../styles");
var colors = styles_1.default.colors;
var { ThemeColors } = colors;
;
class BarData extends GenericComponent_1.GenericComponent {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            bars: []
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(data, index) {
        this.trigger('onBarClick', data.payload);
    }
    render() {
        var { values, bars } = this.state;
        var { title, subtitle, props } = this.props;
        var { barProps, showLegend, nameKey } = props;
        if (!values) {
            return null;
        }
        var barElements = [];
        if (values && values.length && bars) {
            barElements = bars.map((bar, idx) => {
                return <recharts_1.Bar key={idx} dataKey={bar} fill={ThemeColors[idx]} onClick={this.handleClick}/>;
            });
        }
        // Todo: Receive the width of the SVG component from the container
        return (<Card_1.default title={title} subtitle={subtitle}>
        <recharts_1.ResponsiveContainer>
          <recharts_1.BarChart data={values} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} {...barProps}>
            <recharts_1.XAxis dataKey={nameKey || ''}/>
            <recharts_1.YAxis />
            <recharts_1.CartesianGrid strokeDasharray="3 3"/>
            <recharts_1.Tooltip />
            {barElements}
            {showLegend !== false && <recharts_1.Legend layout="vertical" align="right" verticalAlign="top" wrapperStyle={{ right: 5 }}/>}
          </recharts_1.BarChart>
        </recharts_1.ResponsiveContainer>
      </Card_1.default>);
    }
}
exports.default = BarData;
