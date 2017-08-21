import { IFormatTest } from './formats';

export default <IFormatTest[]>[
  {
    format: 'timespan',
    params: {
      values: ["24 hours","1 week","1 month","3 months"]    
    },
    state: {
      selectedValue: "1 month"
    },
    expected: {
      "granularity": "1d", 
      "queryTimespan": "P30D", 
      "values-all": ["24 hours", "1 week", "1 month", "3 months"], 
      "values-selected": "1 month"
    }
  },
  {
    format: 'timespan',
    params: {
      values: ["24 hours","1 week","1 month","3 months"]    
    },
    state: {
      selectedValue: "24 hours"
    },
    expected: {
      "granularity": "5m", 
      "queryTimespan": "PT24H", 
      "values-all": ["24 hours", "1 week", "1 month", "3 months"], 
      "values-selected": "24 hours"
    }
  }
];