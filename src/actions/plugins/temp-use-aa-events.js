import { ApplicationInsightsData } from './application-insights-data';

// Example of using with conversion rate graph
var a = new ApplicationInsightsData({
  query: ` customEvents` +
        ` | extend successful=customDimensions.successful` +
        ` | where name startswith 'message.convert'` +
        ` | summarize event_count=count() by name, tostring(successful)`,
  dependencies: [ 'timespan' ],
  mappings: [
    { key: 'name' },
    { key: 'successful', val: (val) => val === 'true' },
    { key: 'event_count', def: 0 }
  ]
})

