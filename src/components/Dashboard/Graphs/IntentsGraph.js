import connectToStores from 'alt-utils/lib/connectToStores';
import React, { Component } from 'react';
import _ from 'lodash';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Card, CardHeader, CardMedia} from 'material-ui/Card';

import colors from '../colors';
import styles from '../styles';

import ConversationMessages from './ConversationMessages';
import IntentConversations from './IntentConversations';
import IntentStore from '../../../stores/IntentStore';
import IntentActions from '../../../actions/IntentActions';

class IntentsGraph extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static getStores() {
    return [IntentStore];
  }

  static getPropsFromStores() {
    return IntentStore.getState();
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(data, index) {
    const { intents } = this.props;
    IntentActions.selectIntent(intents[index].intent);
  }

  render() {
    const { intents } = this.props;

    if (intents.length === 0) return null;

    return (
      <Card className='dash-card'>
        <CardHeader
            style={styles.cardHeaderStyle}
            title="Intents"
            subtitle="Which intents are used" />
        <CardMedia style={styles.cardMediaStyle}>
          <ResponsiveContainer>
            <BarChart width={520} height={240} data={intents}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis dataKey="intent"/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Bar dataKey="count" fill={colors.IntentsColor} onClick={this.handleClick}/>
            </BarChart>
          </ResponsiveContainer>
        </CardMedia>
        <IntentConversations/>
        <ConversationMessages />
      </Card>
    );
  }
}

export default connectToStores(IntentsGraph);