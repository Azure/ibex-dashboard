Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const GenericComponent_1 = require("./GenericComponent");
const Card_1 = require("../Card");
const recharts_1 = require("recharts");
const moment = require("moment");
const styles_1 = require("../styles");
var colors = styles_1.default.colors;
var { ThemeColors } = colors;
;
;
class Scatter extends GenericComponent_1.GenericComponent {
    dateFormat(time) {
        return moment(time).format('MMM-DD');
    }
    hourFormat(time) {
        return moment(time).format('HH:mm');
    }
    render() {
        var { title, subtitle } = this.props;
        var { timeFormat, values, lines } = this.state;
        var format = timeFormat === "hour" ? this.hourFormat : this.dateFormat;
        const data01 = [{ x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
            { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
            { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 }];
        const data02 = [{ x: 200, y: 260, z: 240 }, { x: 240, y: 290, z: 220 },
            { x: 190, y: 290, z: 250 }, { x: 198, y: 250, z: 210 },
            { x: 180, y: 280, z: 260 }, { x: 210, y: 220, z: 230 }];
        var scatters = [];
        // if (data && data.length) {
        //   scatters = lines.map((line, idx) => {
        //     return <Scatter key={idx} name={line.name} dataKey={line} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>
        //   })
        // }
        return (<Card_1.default title={title} subtitle={subtitle}>
        <recharts_1.ResponsiveContainer>
          <recharts_1.ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <recharts_1.XAxis dataKey={'x'} tickFormatter={format} minTickGap={20} name='stature'/>
            <recharts_1.YAxis dataKey={'y'} name='weight' unit='kg'/>
            <recharts_1.ZAxis dataKey={'z'} range={[60, 600]} name='score' unit='km'/>
            <recharts_1.CartesianGrid strokeDasharray="3 3"/>
            <recharts_1.Tooltip cursor={{ strokeDasharray: '3 3' }}/>
            <recharts_1.Legend />
            <recharts_1.Scatter name='A school' data={data01} fill={colors.ThemeColors[0]}/>
            <recharts_1.Scatter name='B school' data={data02} fill={colors.ThemeColors[1]}/>
          </recharts_1.ScatterChart>
        </recharts_1.ResponsiveContainer>
      </Card_1.default>);
    }
}
exports.default = Scatter;
