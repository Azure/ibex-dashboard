export default <IDashboardConfig>{
  id: 'id',
  url: 'url',
  icon: 'icon',
  name: 'name',
  config: {
    connections: {},
    layout: {
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}
    }
  },
  dataSources: [
    {
			id: "samples",
			type: "Sample",
			params: { 
        samples: { 
          data_for_table: [
            { id: "value1", count: 60 },
            { id: "value2", count: 10 },
            { id: "value3", count: 30 }
          ]
        } 
      }
		}
  ],
  filters: [],
  elements: [
    {
      id: 'table',
      type: 'Table',
      size: { w: 1, h: 1},
      title: 'Table',
      subtitle: 'Table',
      dependencies: { values: 'samples:data_for_table' },
      props: {
        cols: [
          {
            header: 'Conversation Id',
            field: 'id'
          }, 
          {
            header: 'Count',
            field: 'count'
          }
        ]
      }
    }
  ],
  dialogs: []
};