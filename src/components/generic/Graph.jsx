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
var Card_1 = require("material-ui/Card");
var recharts_1 = require("recharts");
var moment = require("moment");
var styles_1 = require("../styles");
var colors = styles_1.default.colors;
var ThemeColors = colors.ThemeColors;
;
;
var Graph = (function (_super) {
    __extends(Graph, _super);
    function Graph(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = _this.onChange.bind(_this);
        _this.state = props.store.getState();
        return _this;
    }
    Graph.prototype.componentDidMount = function () {
        this.props.store.listen(this.onChange);
    };
    Graph.prototype.componentWillUnmount = function () {
        this.props.store.unlisten(this.onChange);
    };
    Graph.prototype.onChange = function (state) {
        this.setState(state);
    };
    Graph.prototype.dateFormat = function (time) {
        return moment(time).format('MMM-DD');
    };
    Graph.prototype.hourFormat = function (time) {
        return moment(time).format('HH:mm');
    };
    Graph.prototype.render = function () {
        var data = this.state[this.props.data || 'data'] || [];
        var lines = this.state[this.props.lines || 'lines'] || [];
        var format = this.state.timespan === "24 hours" ? this.hourFormat : this.dateFormat;
        var glines = [];
        if (data && data.length) {
            glines = lines.map(function (line, idx) {
                return <recharts_1.Line key={idx} type="monotone" dataKey={line} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>;
            });
        }
        return (<Card_1.Card className='dash-card'>
        <Card_1.CardHeader className='card-header' title='Users' subtitle="How many messages were send in each channel"/>
        <Card_1.CardMedia style={styles_1.default.cards.cardMediaStyle}>
          <recharts_1.ResponsiveContainer>
            <recharts_1.LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <recharts_1.XAxis dataKey="time" tickFormatter={format} minTickGap={20}/>
              <recharts_1.YAxis />
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.Tooltip />
              <recharts_1.Legend />
              {glines}
            </recharts_1.LineChart>
          </recharts_1.ResponsiveContainer>
        </Card_1.CardMedia>
      </Card_1.Card>);
    };
    return Graph;
}(React.Component));
exports.default = Graph;
