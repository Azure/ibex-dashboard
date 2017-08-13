
export interface IFormatTest {
  format: any,
  state: any,
  expected: any
};

export const tests: IDict<IFormatTest> = {
  bars: {
    format: {
      type: 'bars', 
      args: { 
        barsField: 'barField', 
        seriesField: 'seriesField' 
      }
    },
    state: {
      values: [
        { count: 10, barField: 'bar 1', seriesField: 'series1Value' },
        { count: 15, barField: 'bar 2', seriesField: 'series1Value' },
        { count: 20, barField: 'bar 1', seriesField: 'series2Value' },
        { count: 44, barField: 'bar 3', seriesField: 'series2Value' },
      ]
    },
    expected: {
      'bars': ['series1Value', 'series2Value'],
      'bar-values': [
        {'series1Value': 10, 'series2Value': 20, 'value': 'bar 1'}, 
        {'series1Value': 15, 'value': 'bar 2'}, 
        {'series2Value': 44, 'value': 'bar 3'}
      ]
    }
  },
  filter: {
    format: 'filter',
    state: {
      values: [
        { value: 'value 1' },
        { value: 'value 2' },
        { value: 'value 3' }
      ]
    },
    expected: {
      'values-all': [ 'value 1', 'value 2', 'value 3' ],
      'values-selected': [ ],
    }
  },
  flags: {
    format: 'flags',
    state: { values: [ 'value 1', 'value 2', 'value 3' ] },
    expected:  {
      'value 1': false,
      'value 2': false,
      'value 3': false,
      'values-all': [ 'value 1', 'value 2', 'value 3' ],
      'values-selected': [],
    }
  },
  retention: {
    format: 'retention',
    state: {
      values: [
        {
          totalUnique: 10,
          totalUniqueUsersIn24hr: 5,
          totalUniqueUsersIn7d: 7,
          totalUniqueUsersIn30d: 10,
          returning24hr: 3,
          returning7d: 3,
          returning30d: 6
        }
      ]
    },
    expected: {
      "returning": 0, 
      "returning24hr": 3, 
      "returning30d": 6, 
      "returning7d": 3, 
      "total": 0, 
      "totalUnique": 10,
      "totalUniqueUsersIn24hr": 5, 
      "totalUniqueUsersIn30d": 10, 
      "totalUniqueUsersIn7d": 7, 
      "values": [
        { "retention": "60%", "returning": 3, "timespan": "24 hours", "unique": 5 }, 
        { "retention": "43%", "returning": 3, "timespan": "7 days", "unique": 7 }, 
        { "retention": "60%", "returning": 6, "timespan": "30 days", "unique": 10 }
      ]
    }
  }
};