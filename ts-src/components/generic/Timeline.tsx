import * as React from 'react';
import { GenericComponent } from './GenericComponent';
import * as moment from 'moment';
import classnames from 'classnames';
import * as _ from 'lodash';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import PersonIcon from 'material-ui/svg-icons/social/person';
import ActionQuestionAnswer from 'material-ui/svg-icons/action/question-answer';

import styles from '../styles';

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
        return <Line key={idx} type="monotone" dataKey={line} dot={false} ticksCount={5}/>
      })
    }

    return (
      <Card className='dash-card'>
        <CardHeader
            className='card-header'
            title='Channel Usage'
            subtitle="How many messages were send in each channel" />
        <CardMedia style={styles.cards.cardMediaStyle}>
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
        </CardMedia>
      </Card>
    );
  }
}