/// <reference path="../../../client/@types/types.d.ts"/>
import * as _ from 'lodash';

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
  id: "app_insights_sample",
  name: "Application Insights Sample",
  icon: "dashboard",
  url: "app_insights_sample",
  description: "A basic Application Insights dashboard",
  preview: "/images/sample.png",
  category: 'Samples',
  html: `
    <div>
      This is a basic Application Insights dashboard. </br>
      This dashboard is built to view Requests that are sent to Application Insights.
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
      id: "timespan",
      type: "Constant",
      params: { values: ["24 hours", "1 week", "1 month"], selectedValue: "24 hours" },
      format: "timespan"
    },
    {
      id: "requests",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan", granularity: "timespan:granularity" },
      params: {
        table: "requests",
        queries: {
          count: {
            query: ({ granularity }) => {
              return `
               summarize count= count() by bin(timestamp, ${granularity}) |
               order by timestamp asc 
              `
            },
            format: { type: "timeline", args: { timeField: "timestamp", valueField: "count" } }
          },
        }
      }
    }
  ],
  filters: [
    {
      type: "TextFilter",
      title: "Timespan",
      source: "timespan",
      actions: { onChange: "timespan:updateSelectedValue" },
      first: true
    },
  ],
  elements: [
    {
      id: "serverResponseTime",
      type: "Timeline",
      title: "Server requests count",
      subtitle: "The server requests count in the selected time range",
      size: { w: 5, h: 8 },
      source: "requests:count",
    },
  ],
  dialogs: [
  ]
}