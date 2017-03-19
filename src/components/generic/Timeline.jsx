Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const moment = require("moment");
const recharts_1 = require("recharts");
const Card_1 = require("../Card");
const colors_1 = require("../colors");
var { ThemeColors } = colors_1.default;
class Timeline extends GenericComponent_1.GenericComponent {
    // static propTypes = {}
    // static defaultProps = {}
    dateFormat(time) {
        return moment(time).format('MMM-DD');
    }
    hourFormat(time) {
        return moment(time).format('HH:mm');
    }
    render() {
        var { timeFormat, values, lines } = this.state;
        var { title, subtitle, theme } = this.props;
        var format = timeFormat === "hour" ? this.hourFormat : this.dateFormat;
        var themeColors = theme || ThemeColors;
        var lineElements = [];
        if (values && values.length && lines) {
            lineElements = lines.map((line, idx) => {
                return <recharts_1.Line key={idx} type="monotone" dataKey={line} stroke={themeColors[idx % themeColors.length]} dot={false} ticksCount={5}/>;
            });
        }
        return (<Card_1.default title={title} subtitle={subtitle}>
        <recharts_1.ResponsiveContainer>
          <recharts_1.LineChart data={values} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <recharts_1.XAxis dataKey="time" tickFormatter={format} minTickGap={20}/>
            <recharts_1.YAxis type="number" domain={['dataMin', 'dataMax']}/>
            <recharts_1.CartesianGrid strokeDasharray="3 3"/>
            <recharts_1.Tooltip />
            <recharts_1.Legend />
            {lineElements}
          </recharts_1.LineChart>
        </recharts_1.ResponsiveContainer>
      </Card_1.default>);
    }
}
exports.default = Timeline;
