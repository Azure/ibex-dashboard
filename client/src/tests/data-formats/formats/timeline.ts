import { IFormatTest } from './formats';

export default <IFormatTest>{
  format: { 
    type: 'timeline',
    args: { 
      timeField: 'timestamp',
      lineField: 'line',
      valueField: 'value'
   }
  },
  state: {
    values: [
      { timestamp: '2015-01-01T00:00:01Z', line: 'red', value: 40 },
      { timestamp: '2015-01-02T00:00:01Z', line: 'red', value: 50 },
      { timestamp: '2015-01-03T00:00:01Z', line: 'red', value: 60 },
      { timestamp: '2015-01-01T00:00:01Z', line: 'blue', value: 10 },
      { timestamp: '2015-01-02T00:00:01Z', line: 'blue', value: 77 },
      { timestamp: '2015-01-03T00:00:01Z', line: 'blue', value: 30 }
    ]
  },
  expected: {
    "graphData": [
      {"blue": 10, "red": 40, "time": "Thu, 01 Jan 2015 00:00:01 GMT"}, 
      {"blue": 77, "red": 50, "time": "Fri, 02 Jan 2015 00:00:01 GMT"}, 
      {"blue": 30, "red": 60, "time": "Sat, 03 Jan 2015 00:00:01 GMT"}
    ], 
    "lines": ["red", "blue"], 
    "pieData": [
      {"name": "red", "value": 150}, 
      {"name": "blue", "value": 117}
    ],
    "timeFormat": "date"
  }
};