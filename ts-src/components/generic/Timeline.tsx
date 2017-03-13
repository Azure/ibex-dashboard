import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import * as moment from 'moment';
import * as _ from 'lodash';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Card from '../Card';

import Button from 'react-md/lib/Buttons/Button';

import styles from '../styles';
var colors = styles.colors;
var { ThemeColors } = colors;

export default class Timeline extends GenericComponent<any> {
  // static propTypes = {}
  // static defaultProps = {}

  dateFormat (time) {
    return moment(time).format('MMM-DD');
  }
  
  hourFormat (time) {
    return moment(time).format('HH:mm');
  }

  render() {
    var { timeFormat, values, lines } = this.state;

    var format = timeFormat === "hour" ? this.hourFormat : this.dateFormat;

    var lineElements = [];
    if (values && values.length && lines) {
      lineElements = lines.map((line, idx) => {
        return <Line key={idx} type="monotone" dataKey={line} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>
      })
    }

    return (
      <Card title='Channel Usage'
            subtitle="How many messages were send in each channel 2">
        <ResponsiveContainer>
          <LineChart data={values} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="time" tickFormatter={format} minTickGap={20}/>
            <YAxis type="number" domain={['dataMin', 'dataMax']}/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip />
            <Legend/>
            {lineElements}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    );
  }
}