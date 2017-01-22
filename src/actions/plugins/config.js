module.exports = {
  dataSources: [
    {
      id: 'timespan',
      type: 'constant',
      values: ['24 hours', '1 week', '1 month'],
      defaultValue: '24 hours'
    },
    {
      id: 'conversionRate',
      type: 'app-insights',
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
  ]
};