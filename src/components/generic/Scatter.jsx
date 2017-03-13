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
var moment = require("moment");
var styles_1 = require("../styles");
var colors = styles_1.default.colors;
var ThemeColors = colors.ThemeColors;
;
;
var Scatter = (function (_super) {
    __extends(Scatter, _super);
    function Scatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scatter.prototype.dateFormat = function (time) {
        return moment(time).format('MMM-DD');
    };
    Scatter.prototype.hourFormat = function (time) {
        return moment(time).format('HH:mm');
    };
    Scatter.prototype.render = function () {
        var _a = this.state, timeFormat = _a.timeFormat, values = _a.values, lines = _a.lines;
        var format = timeFormat === "hour" ? this.hourFormat : this.dateFormat;
        var data01 = [{ x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
            { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
            { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 }];
        var data02 = [{ x: 200, y: 260, z: 240 }, { x: 240, y: 290, z: 220 },
            { x: 190, y: 290, z: 250 }, { x: 198, y: 250, z: 210 },
            { x: 180, y: 280, z: 260 }, { x: 210, y: 220, z: 230 }];
        var scatters = [];
        // if (data && data.length) {
        //   scatters = lines.map((line, idx) => {
        //     return <Scatter key={idx} name={line.name} dataKey={line} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>
        //   })
        // }
        return (<Card_1.default title='Scatter' subtitle="Scatter chart bla bla">
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
    };
    return Scatter;
}(GenericComponent_1.GenericComponent));
exports.default = Scatter;
