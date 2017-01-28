import * as React from 'react';
import Graph from './Graph';
import PieData from './PieData';

import TimelineStore from '../../stores/TimelineStore';
import TimespanStore from '../../stores/TimespanStore';
import Timespan from '../Dashboard/Timespan';
import TimespanActions from '../../actions/TimespanActions';
import common from '../../actions/actions-common';

import {PipeComponent} from '../../generic';

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

export default class Dashboard extends React.Component<any, any> {

  dataSource1 = null;
  dataSource2 = null;

  constructor(props) {
    super(props);

    TimespanActions.update24Hours();

    this.dataSource1 = PipeComponent.createDataSource({
      id: 'timespan',
      type: 'Constant',
      params: {
        values: ['24 hours', '1 week', '1 month'],
        selectedValue: '1 month'
      }
    });

    this.dataSource2 = PipeComponent.createDataSource({
      id: 'conversions',
      type: 'ApplicationInsights/Query',
      dependencies: ['timespan'], 
      params: {
        query: ` customEvents` +
                ` | extend successful=customDimensions.successful` +
                ` | where name startswith 'message.convert'` +
                ` | summarize event_count=count() by name, tostring(successful)`,
        mappings: [
          { key: 'name' },
          { key: 'successful', val: (val) => val === 'true' },
          { key: 'event_count', def: 0 }
        ]
      }
    });
  }

  componentDidMount() {
    this.dataSource1.store.listen((state) => {
      this.dataSource2.action.updateDependencies(state);
    })
    this.dataSource1.action.initialize();
  }

  render() {
    return (
      <div>
        <Timespan />
        <PieData store={this.dataSource2.store} />
      </div>
    );
  }
}