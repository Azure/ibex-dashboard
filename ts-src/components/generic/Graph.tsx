import * as React from 'react';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import * as _ from 'lodash';
import * as moment from 'moment';

import colors from '../Dashboard/colors';
import styles from '../Dashboard/styles';
var { ThemeColors } = colors;

interface IGraphProps {};

interface IGraphState {};

export default class Graph extends React.Component<any, any> {

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

  dateFormat (time) {
    return moment(time).format('MMM-DD');
  }
  
  hourFormat (time) {
    return moment(time).format('HH:mm');
  }

  render() {

    var data = this.state[this.props.data || 'data'] || [];
    var lines = this.state[this.props.lines || 'lines'] || [];
    var format = this.state.timespan === "24 hours" ? this.hourFormat : this.dateFormat;

    var glines = [];
    if (data && data.length) {
      glines = lines.map((line, idx) => {
        return <Line key={idx} type="monotone" dataKey={line} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>
      })
    }

    return (
      <Card className='dash-card'>
        <CardHeader
            className='card-header'
            title='Users'
            subtitle="How many messages were send in each channel" />
        <CardMedia style={styles.cardMediaStyle}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis dataKey="time" tickFormatter={format} minTickGap={20}/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend/>
              {glines}
            </LineChart>
          </ResponsiveContainer>
        </CardMedia>
      </Card>
    );
  }
}