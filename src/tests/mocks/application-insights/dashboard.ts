export default <IDashboardConfig>{
  id: 'id',
  url: 'url',
  icon: 'icon',
  name: 'name',
  config: {
    connections: { "application-insights": { appId: '1', apiKey: '1' } },
    layout: {
			cols: { lg: 12,md: 10,sm: 6,xs: 4,xxs: 2 },
			breakpoints: { lg: 1200,md: 996,sm: 768,xs: 480,xxs: 0 }
    }
  },
  dataSources: [
    {
      id: 'timespan',
      type: 'Constant',
      params: {
        values: ['24 hours', '1 week', '1 month'],
        selectedValue: '1 month'
      },
      calculated: (state, dependencies) => {
        var queryTimespan = state.selectedValue === '24 hours' ? 'PT24H' : state.selectedValue === '1 week' ? 'P7D' : 'P30D';
        var granularity = state.selectedValue === '24 hours' ? '5m' : state.selectedValue === '1 week' ? '1d' : '1d';

        return { queryTimespan, granularity };
      }
    },
    {
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
    }
  ],
  filters: [],
  elements: [],
  dialogs: []
}