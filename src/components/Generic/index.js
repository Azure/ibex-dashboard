import React, { Component } from 'react';
import Graph from './Graph';

import TimelineStore from '../../stores/TimelineStore';
import Timespan from '../Dashboard/Timespan';
import TimespanActions from '../../actions/TimespanActions';
import common from '../../actions/actions-common';

var graphs = [
  {
    id: 'graph1',
    title: 'Users',
    store: 'TimelineStore',
    data: 'data',
    lines: 'channels',
    type: 'timeline'
  }
];

var queries = [
  {
    id: 'timespan',
    type: 'calculated',
    values: ['24 hours', '1 week', '1 month'],
    selectedValue: '24 hours'
  },

  {
    id: 'conversionRate',
    type: 'app-insights',
    dependencies: ['timespan'], 
    query: ` customEvents` +
            ` | extend successful=customDimensions.successful` +
            ` | where name startswith 'message.convert'` +
            ` | summarize event_count=count() by name, tostring(successful)`,
    mappings: [
      { key: 'name' },
      { key: 'successful', val: (val) => val === 'true' },
      { key: 'event_count', def: 0 }
    ]
  },

  {
    id: 'timelineMessages',
    type: 'app-insights',
    dependencies: ['timespan'], 
    query: (state, timespan) => {

      var granularity = common.timespanToGranularity(timespan);
      return ` customEvents` +
              ` | where name == 'Activity'` + 
              ` | summarize event_count=count() by bin(timestamp, ${granularity}), name, tostring(customDimensions.channel)` +
              ` | order by timestamp asc `
    },
    mappings: [
      { key: 'timestamp' },
      { key: 'name' },
      { key: 'channel' },
      { key: 'event_count', def: 0 }
    ]
  },

  {
    id: 'channels',
    type: 'calculated',
    dependencies: ['timelineMessages'],
    values: (state, data) => {
      var channels = {};
      data.forEach(row => {
        if (!channels[row.channel]) channels[row.channel] = { name: row.channel, value: 0 };
        channels[row.channel].value += row.count;
      });
      return Object.keys(channels);
    }
  }
];

export default class Dashboard extends Component {

  componentDidMount() {
    TimespanActions.update24Hours();
  }

  render() {
    return (
      <div>
        <Timespan />
        <Graph store={TimelineStore} lines="channels" />
      </div>
    );
  }
}