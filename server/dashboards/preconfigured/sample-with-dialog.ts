/// <reference path="../../../client/@types/types.d.ts"/>
import * as _ from 'lodash';

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
  id: "basic_sample",
  name: "Basic Sample",
  icon: "extension",
  url: "basic_sample",
  description: "A basic sample to understand a basic dashboard",
  preview: "/images/sample.png",
  category: 'Samples',
  html: `
    <div>
      This is a basic sample dashboard, with JSON based sample data source, to show how data from different data sources
      can be manipulated and connected to visual components.
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
      id: "samples",
      type: "Sample",
      params: {
        samples: {
          "values": [
            { count: 10, barField: 'bar 1', seriesField: 'series1Value' },
            { count: 15, barField: 'bar 2', seriesField: 'series1Value' },
            { count: 20, barField: 'bar 1', seriesField: 'series2Value' },
            { count: 44, barField: 'bar 3', seriesField: 'series2Value' }
          ]
        }
      },
      format: {
        type: "bars",
        args: { 
          valueField: "count", 
          barsField: "barField", 
          seriesField: "seriesField", 
          threshold: 10 
        }
      }
    }
  ],
  filters: [],
  elements: [
    {
      id: "pie_sample1",
      type: "PieData",
      title: "Pie Sample 1",
      subtitle: "Description of pie sample 1",
      source: "samples",
      props: { showLegend: true }
    }
  ],
  dialogs: []
}
