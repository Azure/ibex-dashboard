return {
	id: "qna",
	name: "Sample QnA Maker dashboard",
	icon: "extension",
	url: "qna",
	description: "Sample QnA Maker dashboard",
	preview: "/images/bot-framework-preview.png",
	html: `<h1>Sample QnA Maker dashboard</h1>`,
	config: {
		connections: {
			"application-insights": { appId: "a7f243d7-1754-4bd3-9f93-5fec7aa20009",apiKey: "rauayprkvjoppi5ckhzze70wv6m7sv02vkmoa8kn" }
		},
		layout: {
			isDraggable: true,
			isResizable: true,
			rowHeight: 30,
			verticalCompact: false,
			cols: { lg: 12,md: 10,sm: 6,xs: 4,xxs: 2 },
			breakpoints: { lg: 1200,md: 996,sm: 768,xs: 480,xxs: 0 },
			layouts: {
				md: [
					{
						w: 1,
						h: 3,
						x: 0,
						y: 0,
						i: "scorecardTranscripts",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},
					{
						w: 5,
						h: 8,
						x: 1,
						y: 5,
						i: "pie_sample1",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},
					{
						w: 5,
						h: 8,
						x: 5,
						y: 13,
						i: "pie_sample2",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},
					{
						w: 1,
						h: 3,
						x: 9,
						y: 0,
						i: "scorecard_sample1",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},
					{
						w: 1,
						h: 3,
						x: 0,
						y: 8,
						i: "scorecard_sample2",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					}
				]
			}
		}
	},
	dataSources: [
    {
			id: "timespan",
			type: "Constant",
			params: { values: ["24 hours","1 week","1 month","3 months"],selectedValue: "1 month" },
			calculated: (state, dependencies) => {
        var queryTimespan =
          state.selectedValue === '24 hours' ? 'PT24H' :
          state.selectedValue === '1 week' ? 'P7D' :
          state.selectedValue === '1 month' ? 'P30D' :
          'P90D';
        var granularity =
          state.selectedValue === '24 hours' ? '5m' :
          state.selectedValue === '1 week' ? '1d' : '1d';

        return { queryTimespan, granularity };
      }
		},
		{
			id: "ai",
			type: "ApplicationInsights/Query",
			dependencies: { timespan: "timespan",queryTimespan: "timespan:queryTimespan",granularity: "timespan:granularity" },
			params: {
				table: "customEvents",
				queries: {
					transcripts: {
						query: () => `
                where name == 'Transcript'
                | extend customerName=tostring(customDimensions.customerName), text=tostring(customDimensions.text), userTime=tostring(customDimensions.timestamp), state=toint(customDimensions.state), agentName=tostring(customDimensions.agentName), from=tostring(customDimensions.from)  
                | project from, text, customerName, agentName, state, userTime 
                | order by userTime asc `,
						mappings: { agentName: (val) => val === '' },
						calculated: (transcripts) => {
              console.log('transcripts', transcripts);
              return {
                'transcripts-date': transcripts, 
                'transcripts-value': transcripts.length 
              };
            }
					}
				}
			}
		},
		{
			id: "samples",
			type: "Sample",
			params: {
				samples: {
					data_for_pie: [{ name: "value1",value: 60 },{ name: "value2",value: 10 },{ name: "value3",value: 30 }],
					scorecard_data_value: 3000000,
					scorecard_data_subvalue: 4000
				}
			}
		}
	],
	filters: [
		{
			type: "TextFilter",
			title: "Timespan",
			dependencies: { selectedValue: "timespan",values: "timespan:values" },
			actions: { onChange: "timespan:updateSelectedValue" },
			first: true
		},
  ],
	elements: [
		{
			id: "scorecardTranscripts",
			type: "Scorecard",
			title: "Value",
			size: { w: 1,h: 3 },
			dependencies: { value: "ai:transcripts-value",color: "::#2196F3",icon: "::av_timer" }
		},
		{
			id: "pie_sample1",
			type: "PieData",
			title: "Pie Sample 1",
			subtitle: "Description of pie sample 1",
			size: { w: 5,h: 8 },
			dependencies: { values: "samples:data_for_pie" },
			props: { showLegend: true }
		},
		{
			id: "pie_sample2",
			type: "PieData",
			title: "Pie Sample 2",
			subtitle: "Hover on the values to see the difference from sample 1",
			size: { w: 5,h: 8 },
			dependencies: { values: "samples:data_for_pie" },
			props: { showLegend: true,compact: true }
		},
		{
			id: "scorecard_sample1",
			type: "Scorecard",
			title: "Value",
			size: { w: 1,h: 3 },
			dependencies: { value: "samples:scorecard_data_value",color: "::#2196F3",icon: "::av_timer" }
		},
		{
			id: "scorecard_sample2",
			type: "Scorecard",
			title: "Same Value",
			size: { w: 1,h: 3 },
			dependencies: { value: "samples:scorecard_data_value",color: "::#2196F3",icon: "::av_timer",subvalue: "samples:scorecard_data_subvalue" },
			props: { subheading: "Value #2" }
		}
	],
	dialogs: []
}