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
      id: 'filter1',
      type: 'Sample',
      format: 'filter',
      params: {
        samples: {
          'values': [
            {value: 'en'}, 
            {value: 'fr'}, 
            {value: 'de'}
          ]
        }
      }
    },
    {
      id: 'filter2',
      type: 'Sample',
      format: 'filter',
      params: {
        samples: {
          'values': [
            {value: 'skype'}, 
            {value: 'messenger'}, 
            {value: 'slack'}
          ]
        }
      }
    },
    {
      id: 'samples',
      type: 'Sample',
      dependencies: {
        selectedFilter1: 'filter1:values-selected',
        selectedFilter2: 'filter2:values-selected',
      },
      params: {
        samples: {
          data_for_pie: [
            { name: 'skype-en', value: 9, locale: 'en', channel: 'skype' },
            { name: 'skype-fr', value: 8, locale: 'fr', channel: 'skype' },
            { name: 'skype-de', value: 7, locale: 'de', channel: 'skype' },
            { name: 'messenger-en', value: 6, locale: 'en', channel: 'messenger' },
            { name: 'messenger-fr', value: 5, locale: 'fr', channel: 'messenger' },
            { name: 'messenger-de', value: 4, locale: 'de', channel: 'messenger' },
            { name: 'slack-en', value: 3, locale: 'en', channel: 'slack' },
            { name: 'slack-fr', value: 2, locale: 'fr', channel: 'slack' },
            { name: 'slack-de', value: 1, locale: 'de', channel: 'slack' }
          ]
        },
        filters: [
          { dependency: 'selectedFilter1', queryProperty: 'locale' },
          { dependency: 'selectedFilter2', queryProperty: 'channel' }
        ],
      },
      format: {
        type: 'filtered_samples'
      },
    },
    {
      id: 'scorecard',
      type: 'Sample',
      dependencies: {
        filteredData: 'samples:filtered_data_for_pie',
      },
      calculated: (state, dependencies) => {
        const {filteredData} = state;
        const filteredDataValue = filteredData && filteredData.reduce((a, c) => a + c.value, 0) || 0;
        const filteredDataSubvalue = filteredData && filteredData.length || 0;
        return {
          'filtered_data_value': filteredDataValue,
          'filtered_data_subvalue': filteredDataSubvalue,
        };
      }
    }
  ],
  filters: [
    {
      type: 'MenuFilter',
      title: 'Locale',
      subtitle: 'Select locale',
      icon: 'forum',
      source: 'filter1',
      actions: { onChange: 'filter1:updateSelectedValues:values-selected' },
      first: true
    },
    {
      type: 'MenuFilter',
      title: 'Channel',
      subtitle: 'Select channel',
      icon: 'forum',
      source: 'filter2',
      actions: { onChange: 'filter2:updateSelectedValues:values-selected' },
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
      props: { entityType: 'Sessions', showLegend: true }
    },
    {
      id: 'pie_sample2',
      type: 'PieData',
      title: 'Pie Sample 2',
      subtitle: 'Hover on the values to see the difference from sample 1',
      size: { w: 5, h: 8 },
      dependencies: { values: 'samples:filtered_data_for_pie' },
      props: { entityType: 'Sessions', showLegend: true, compact: true }
    },
    {
      id: 'scorecard1',
      type: 'Scorecard',
      title: 'Value',
      size: { w: 1, h: 3 },
      dependencies: {
        value: 'scorecard:filtered_data_value',
        color: '::#2196F3',
        icon: '::av_timer'
      }
    },
    {
      id: 'scorecard2',
      type: 'Scorecard',
      title: 'Same Value',
      size: { w: 1, h: 3 },
      dependencies: {
        value: 'scorecard:filtered_data_value',
        color: '::#2196F3',
        icon: '::av_timer',
        subvalue: 'scorecard:filtered_data_subvalue'
      },
      props: {
        subheading: 'segments'
      }
    }
  ],
  dialogs: []
};