import connectToStores from 'alt-utils/lib/connectToStores';
import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import PersonIcon from 'material-ui/svg-icons/social/person';
import ActionQuestionAnswer from 'material-ui/svg-icons/action/question-answer';

import colors from '../colors';
import styles from '../styles';
var { ThemeColors } = colors;

import TimelineStore from '../../../stores/TimelineStore';
import TimelineActions from '../../../actions/TimelineActions';

class Timeline extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static getStores() {
    return [TimelineStore];
  }

  static getPropsFromStores() {
    return TimelineStore.getState();
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(data, index) {
  }

  handleClose = () => {
    TimelineActions.dismissError();
  }

  dateFormat (time) {
    return moment(time).format('MMM-DD');
  }
  
  hourFormat (time) {
    return moment(time).format('HH:mm');
  }

  channelChecked(channel) {
    TimelineActions.toggleChannel(channel);
  }

  changeMode(mode) {
    TimelineActions.updateMode(mode);
  }

  render() {
    const { data, timespan, channels, excluded, mode } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    var format = timespan === "24 hours" ? this.hourFormat : this.dateFormat;

    var lines = [];
    if (data && data.length) {
      lines = _.without(channels, ...excluded).map((channel, idx) => {
        return <Line key={idx} type="monotone" dataKey={channel} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>
      })
    }

    var titleControls = (
      <div>
        <span key={0}>Channel Usage</span>,
        <IconButton
            key={1}
            tooltip='Show data by messages'
            className={classnames(mode == 'messages' && 'active')} 
            onClick={this.changeMode.bind(this, 'messages')}><ActionQuestionAnswer /></IconButton>,
        <IconButton 
            key={2}
            tooltip='Show data by users'
            className={classnames(mode == 'users' && 'active')}
            onClick={this.changeMode.bind(this, 'users')}><PersonIcon /></IconButton>
      </div>
    );

    return (
      <Card className='dash-card'>
        <CardHeader
            className='card-header'
            title={titleControls}
            subtitle="How many messages were send in each channel" />
        <CardMedia style={styles.cardMediaStyle}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}
                       onClick={this.handleClick}>
              <XAxis dataKey="time" tickFormatter={format} minTickGap={20}/>
              <YAxis type="number" domain={['dataMin', 'dataMax']}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip />
              <Legend/>
              {lines}
            </LineChart>
          </ResponsiveContainer>
          <Dialog
            actions={actions}
            modal={false}
            open={!!this.props.error}
            onRequestClose={this.handleClose}>
            {this.props.error}
          </Dialog>
        </CardMedia>
      </Card>
    );
  }
}

export default connectToStores(Timeline);