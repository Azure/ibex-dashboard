/// <reference path="../../../client/@types/types.d.ts"/>
import * as _ from 'lodash';

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
  id: 'basic_sample_filters',
  name: 'Basic Sample with Filters',
  icon: 'extension',
  url: 'basic_sample_filters',
  description: 'A basic sample to understand a basic dashboard',
  preview: '/images/sample.png',
  category: 'Samples',
  html: `
    <div>
      This is a basic sample dashboard, with JSON based sample data source, to show how data from different data sources
      can be filtered and connected to visual components.
    </div>
  `,
  config: {
    connections: {},
    layout: {
      isDraggable: true,
      isResizable: true,
      rowHeight: 30,
      verticalCompact: false,
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
    }
  },
  dataSources: [
    {
      id: 'samples',
      type: 'Sample',
      dependencies: {
        selectedFilter: 'filters:filter-selected',
      },
      params: {
        samples: {
          data_for_pie: [
            { name: 'value1', value: 1, category: 'app' },
            { name: 'value2', value: 2, category: 'bot' },
            { name: 'value3', value: 3, category: 'bot' },
            { name: 'value4', value: 4, category: 'web' },
            { name: 'value5', value: 5, category: 'web' },
            { name: 'value6', value: 6, category: 'web' },
            { name: 'value6', value: 6, category: 'web' }
          ]
        },
        filters: [{ dependency: 'selectedFilter', queryProperty: 'category' }],
      },
      calculated: (state, dependencies) => {
        const {data_for_pie} = state;
        const {selectedFilter} = dependencies;
        let {filtered_data_value, filtered_data_subvalue} = state;
        let filtered_data_for_pie = data_for_pie;
        if (selectedFilter && selectedFilter.length > 0) {
          filtered_data_for_pie = data_for_pie.filter(i => i.category === selectedFilter.find(f => f === i.category) );
        }
        filtered_data_value = filtered_data_for_pie.length;
        filtered_data_subvalue = filtered_data_for_pie.reduce((a,c) => a + c.value, 0);
        return {
          'filtered_data_value': filtered_data_value || 0,
          'filtered_data_subvalue': filtered_data_subvalue || 0,
          'filtered_data_for_pie': filtered_data_for_pie
        };
      }
    },
    {
      id: 'filters',
      type: 'Sample',
      params: {
        samples: {
          'filter-categories': ['web', 'app', 'bot'],
          'filter-selected': []
        }
      }
    }
  ],
  filters: [
    {
      type: 'MenuFilter',
      title: 'Filter',
      subtitle: 'Select category',
      icon: 'forum',
      dependencies: { selectedValues: 'filters:filter-selected', values: 'filters:filter-categories' },
      actions: { onChange: 'filters:updateSelectedValues:filter-selected' },
      first: true
    },
  ],
  elements: [
    {
      id: 'pie_sample1',
      type: 'PieData',
      title: 'Pie Sample 1',
      subtitle: 'Description of pie sample 1',
      size: { w: 5, h: 8 },
      dependencies: { values: 'samples:filtered_data_for_pie' },
      props: { showLegend: true }
    },
    {
      id: 'pie_sample2',
      type: 'PieData',
      title: 'Pie Sample 2',
      subtitle: 'Hover on the values to see the difference from sample 1',
      size: { w: 5, h: 8 },
      dependencies: { values: 'samples:filtered_data_for_pie' },
      props: { showLegend: true, compact: true }
    },
    {
      id: 'scorecard_sample1',
      type: 'Scorecard',
      title: 'Value',
      size: { w: 1, h: 3 },
      dependencies: {
        value: 'samples:filtered_data_value',
        color: '::#2196F3',
        icon: '::av_timer'
      }
    },
    {
      id: 'scorecard_sample2',
      type: 'Scorecard',
      title: 'Same Value',
      size: { w: 1, h: 3 },
      dependencies: {
        value: 'samples:filtered_data_value',
        color: '::#2196F3',
        icon: '::av_timer',
        subvalue: 'samples:filtered_data_subvalue'
      },
      props: {
        subheading: 'Total value'
      }
    }
  ],
  dialogs: []
}