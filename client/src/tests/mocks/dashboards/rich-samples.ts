import { createDashboard } from './utils';

let dashboard = createDashboard();
dashboard.dataSources.push({
  id: 'data',
  type: 'Constant',
  params: {
    selectedValue: 'default',
    values: [
      { timestamp: '2015-01-01 00:00:01', line: 'red', value: 40 },
      { timestamp: '2015-01-02 00:00:01', line: 'red', value: 50 },
      { timestamp: '2015-01-03 00:00:01', line: 'red', value: 60 },
      { timestamp: '2015-01-01 00:00:01', line: 'blue', value: 10 },
      { timestamp: '2015-01-02 00:00:01', line: 'blue', value: 77 },
      { timestamp: '2015-01-03 00:00:01', line: 'blue', value: 30 }
    ]
  },
  format: { 
    type: 'timeline',
    args: { 
      timeField: 'timestamp',
      lineField: 'line',
      valueField: 'value'
    }
  }
});

export default dashboard;