import dashboard from './timespan';
dashboard.config.connections["application-insights"] = { appId: '1', apiKey: '1' };
dashboard.dataSources.push({
  id: 'events',
  type: 'ApplicationInsights/Query',
  dependencies: { timespan: 'timespan', queryTimespan: 'timespan:queryTimespan' },
  params: {
    query: `customEvents`,
    mappings: [
      { key: 'name' },
      { key: 'successful', val: (val) => val === 'true' },
      { key: 'event_count', def: 0 }
    ]
  }
});

export default dashboard;