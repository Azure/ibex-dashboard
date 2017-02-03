import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import { Card, CardHeader, CardMedia } from 'material-ui/Card';
import { PieChart, Pie, Sector, Cell, Legend, ResponsiveContainer } from 'recharts';

import * as _ from 'lodash';
import * as moment from 'moment';

import styles from '../styles';
var colors = styles.colors;
var { ThemeColors } = colors;

interface IGraphProps {};

interface IGraphState {};

export default class PieData extends GenericComponent<any> {

  state = {
    activeIndex: 0
  }

  constructor(props) {
    super(props);
  
    this.onPieEnter = this.onPieEnter.bind(this);
  }

  onPieEnter(data, index) {
    this.setState({ activeIndex: index});
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
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{name}</text>
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
    var { values } = this.state;
    var { pieProps, showLegend, width, height } = this.props.props;

    if (!values) {
      return null;
    }

    // Todo: Receive the width of the SVG component from the container
    return (
      <Card className='dash-card'>
        <CardHeader
            className='card-header'
            title="Conversion Usage"
            subtitle={`Conversion Rate`} />
        <CardMedia style={styles.cards.cardMediaStyle}>
          <ResponsiveContainer>
            <PieChart width={width || 500} height={height || 240}>
              <Pie
                data={values} 
                cx={120} 
                cy={120} 
                innerRadius={60}
                outerRadius={80} 
                fill="#8884d8"
                onMouseEnter={this.onPieEnter}
                activeIndex={this.state.activeIndex}
                activeShape={this.renderActiveShape.bind(this)} 
                paddingAngle={0}
                {...pieProps}>
                {
                  values.map((entry, index) => <Cell key={index} fill={ThemeColors[index % ThemeColors.length]}/>)
                }
                <Cell key={0} fill={colors.GoodColor}/>
                <Cell key={1} fill={colors.BadColor}/>
              </Pie>
              {showLegend !== false && <Legend layout="vertical" align="right" verticalAlign="top" /> }
            </PieChart>
          </ResponsiveContainer>
        </CardMedia>
      </Card>
    );
  }
}