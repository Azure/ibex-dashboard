import * as React from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import { PieChart, Pie, Sector, Cell, Legend } from 'recharts';

import * as _ from 'lodash';
import * as moment from 'moment';

import colors from '../Dashboard/colors';
import styles from '../Dashboard/styles';
var { ThemeColors } = colors;

interface IGraphProps {};

interface IGraphState {};

export default class PieData extends React.Component<any, any> {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state = props.store.getState();
  }

  componentDidMount() {
    this.props.store.listen(this.onChange);
  }

  componentWillUnmount() {
    this.props.store.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  renderActiveShape = (props) => {
    const { mode } = this.props;
    var type = mode === 'users' ? 'Users' : 'Messages';

    const RADIAN = Math.PI / 180;
    const { name, cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    var c : any = {};
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
    c.textAnchor = 'start'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={c.cx}
          cy={c.cy}
          startAngle={300}
          endAngle={60}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${c.sx},${c.sy}L${c.mx},${c.my}L${c.ex},${c.ey}`} stroke={fill} fill="none"/>
        <circle cx={c.ex} cy={c.ey} r={2} fill={fill} stroke="none"/>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} textAnchor={c.textAnchor} fill="#333">{`${value} ${type.toLowerCase()}`}</text>
        <text x={c.ex + (c.cos >= 0 ? 1 : -1) * 12} y={c.ey} dy={18} textAnchor={c.textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  
  render() {
    const { conversions } = this.state;

    var total : any = _.find(conversions, { name: 'message.convert.start' });
    var successful: any = _.find(conversions, { name: 'message.convert.end', successful: true }) || { event_count: 0 };

    if (!total) {
      return null;
    }

    var values = [
      { name: 'Successful', value: successful.event_count },
      { name: 'Failed', value: total.event_count - successful.event_count },
    ];

    // Todo: Receive the width of the SVG component from the container
    return (
      <Card className='dash-card'>
        <CardHeader
            className='card-header'
            title="Conversion Usage"
            subtitle={`Conversion Rate`} />
        <CardMedia style={styles.cardMediaStyle}>
          <PieChart width={500} height={240}>
            <Pie
              data={values} 
              cx={270} 
              cy={120} 
              innerRadius={60}
              outerRadius={80} 
              fill="#8884d8"
              activeIndex={0}
              activeShape={this.renderActiveShape.bind(this)} 
              paddingAngle={0}>
              <Cell key={0} fill={colors.GoodColor}/>
              <Cell key={1} fill={colors.BadColor}/>
            </Pie>
            <Legend wrapperStyle={{ marginLeft: 70 }} />
          </PieChart>
        </CardMedia>
      </Card>
    );
  }
}