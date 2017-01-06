import React, { Component } from 'react';
import Graph from './Graph';

import TimelineStore from '../../stores/TimelineStore';
import UsersStore from '../../stores/UsersStore';
import TimespanActions from '../../actions/TimespanActions';

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

export default class Dashboard extends Component {

  componentDidMount() {
    TimespanActions.update24Hours();
  }

  render() {
    return (
      <Graph store={TimelineStore} lines="channels" />
    );
  }
}