/// <reference path="../../../client/@types/types.d.ts"/>
import * as _ from 'lodash';

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
	id: "sample_with_dialog",
	name: "Sample with Dialog",
	icon: "extension",
	url: "sample_with_dialog",
	description: "A basic sample to understand a basic dashboard",
	preview: "/images/sample.png",
	category: "Samples",
	html: `<div>
      This is a basic sample dashboard, with JSON based sample data source, to show how data from different data sources
      can be manipulated and connected to visual components.
    </div>`,
	config: {
		connections: {  },
		layout: {
			isDraggable: true,
			isResizable: true,
			rowHeight: 30,
			verticalCompact: false,
			cols: { lg: 12,md: 10,sm: 6,xs: 4,xxs: 2 },
			breakpoints: { lg: 1200,md: 996,sm: 768,xs: 480,xxs: 0 }
		}
	},
	dataSources: [
		{
			id: "samples",
			type: "Sample",
			params: {
				samples: {
					values: [
						{ count: 10,barField: "bar 1",seriesField: "series1Value" },
						{ count: 15,barField: "bar 2",seriesField: "series1Value" },
						{ count: 20,barField: "bar 1",seriesField: "series2Value" },
						{ count: 44,barField: "bar 3",seriesField: "series2Value" }
					]
				}
			},
			format: {
				type: "bars",
				args: { valueField: "count",barsField: "barField",seriesField: "seriesField",threshold: 10 }
			}
		}
	],
	filters: [],
	elements: [
		{
			id: "bar_sample1",
			type: "BarData",
			title: "Bars Sample 1",
			subtitle: "Description of bars sample 1",
			source: "samples",
			size: { w: 6,h: 8 },
			actions: { onBarClick: { action: "dialog:sample_dlg",params: { title: "args:value",param1: "args:value" } } }
		}
	],
	dialogs: [
		{
			id: "sample_dlg",
			params: ["title","param1"],
			dataSources: [
        {
          id: "dialog-data",
          type: "Sample",
          dependencies: { param1_dependency: "dialog_sample_dlg:param1" },
          params: {
            samples: {
              values: [
                { count: 199,barField: "bar 1",seriesField: "series1Value" },
                { count: 105,barField: "bar 1",seriesField: "series1Value" },
                { count: 203,barField: "bar 2",seriesField: "series2Value" },
                { count: 445,barField: "bar 2",seriesField: "series2Value" }
              ]
            }
          },
          calculated: (state, dependencies) => {
            let { values } = state;
            let { param1_dependency } = dependencies;
            return {
              values: _.filter(values, { barField: param1_dependency })
            };
          },
          format: {
            type: "bars",
            args: { valueField: "count",barsField: "barField",seriesField: "seriesField",threshold: 10 }
          }
        }
      ],
			elements: [
				{
					id: "dialog-sample-bars",
					type: "BarData",
					title: "Sample bars in dialog",
					subtitle: "Sample bars in dialog with some param filter",
					size: { w: 6,h: 8 },
					source: "dialog-data"
				}
			]
		}
	]
}