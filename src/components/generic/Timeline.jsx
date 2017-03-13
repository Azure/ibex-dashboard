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
var moment = require("moment");
var recharts_1 = require("recharts");
var Card_1 = require("../Card");
var styles_1 = require("../styles");
var colors = styles_1.default.colors;
var ThemeColors = colors.ThemeColors;
var Timeline = (function (_super) {
    __extends(Timeline, _super);
    function Timeline() {
        return _super !== null && _super.apply(this, arguments) || this;
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
                return <recharts_1.Line key={idx} type="monotone" dataKey={line} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>;
            });
        }
        return (<Card_1.default title='Channel Usage' subtitle="How many messages were send in each channel 2">
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
    };
    return Timeline;
}(GenericComponent_1.GenericComponent));
exports.default = Timeline;
