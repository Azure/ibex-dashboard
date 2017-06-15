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
						i: "scorecardAvgScore",
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
						i: "timeline_hits",
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
						i: "channels",
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
						i: "scorecard_total_hits",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					}
				],
				lg: [
					{
						w: 1,
						h: 3,
						x: 10,
						y: 3,
						i: "scorecardAvgScore",
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
						x: 0,
						y: 0,
						i: "timeline_hits",
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
						y: 0,
						i: "channels",
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
						x: 10,
						y: 0,
						i: "scorecard_total_hits",
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
					avgScore: {
						query: () => `
                where name == 'MBFEvent.QNAEvent'
                | extend score=todouble(customDimensions.score)  
                | where score >0
                | summarize avg=bin(avg(score)*100,1) `,
						calculated: (avgscore) => {
              return { 
                'avg-score-value': ''+ avgscore[0].avg+'%',
                'avg-score-color': avgscore[0].avg>=80? '#4caf50' : (avgscore[0].avg>60? '#FFc107' : '#F44336'),
                'avg-score-icon': avgscore[0].avg>=80? 'sentiment_very_satisfied' : (avgscore[0].avg>60? 'sentiment_satisfied' : 'sentiment_dissatisfied')
              };
            }
					},
					totalHits: {
						query: () => `
                where name == 'MBFEvent.QNAEvent'
                | summarize hits=count() `,
						calculated: (hits) => {
              return { 
                'score-hits': hits[0].hits
              };
            }
					},
					scoreHits: {
						query: () => `
                where name == 'MBFEvent.QNAEvent'
                | summarize hits=count() by bin(timestamp,1d) 
                | order by timestamp asc `,
						mappings: { hits: (val) => val || 0 },
						calculated: (timeline, dependencies) => {
              // Timeline handling
              // =================

              let _timeline = {};
              let _channels = {};
              let { timespan } = dependencies;
              let channel = 'hits';

              timeline.forEach(row => {
                var { timestamp, hits } = row;
                var timeValue = (new Date(timestamp)).getTime();

                if (!_timeline[timeValue]) _timeline[timeValue] = {
                  time: (new Date(timestamp)).toUTCString()
                };

                if (!_channels[channel]) _channels[channel] = {
                  name: channel,
                  value: 0
                };
                
                _timeline[timeValue][channel] = hits;
                _channels[channel].value += hits;
              });

              var channels = Object.keys(_channels);
              var channelUsage = _.values(_channels);
              var timelineValues = _.map(_timeline, value => {
                channels.forEach(channel => {
                  if (!value[channel]) value[channel] = 0;
                });
                return value;
              });

              return {
                "timeline-hits-graphData": timelineValues,
                "timeline-hits-channelUsage": channelUsage,
                "timeline-hits-timeFormat": (timespan === "24 hours" ? 'hour' : 'date'),
                "timeline-hits-channels": channels
              };
            }
					},
          users_timeline: {
						query: (dependencies) => {
              var { granularity } = dependencies;
              return `
                  where name == 'MBFEvent.QNAEvent' |
                  summarize count=dcount(tostring(customDimensions.userName)) by bin(timestamp, ${granularity}), name, channel=tostring(customDimensions.channel) |
                  order by timestamp asc`
            },
						mappings: { channel: (val) => val || "unknown",count: (val) => val || 0 },
						calculated: (timeline, dependencies) => {
              // Timeline handling
              // =================

              let _timeline = {};
              let _channels = {};
              let { timespan } = dependencies;

              timeline.forEach(row => {
                var { channel, timestamp, count } = row;
                var timeValue = (new Date(timestamp)).getTime();

                if (!_timeline[timeValue]) _timeline[timeValue] = {
                  time: (new Date(timestamp)).toUTCString()
                };
                if (!_channels[channel]) _channels[channel] = {
                  name: channel,
                  value: 0
                };

                _timeline[timeValue][channel] = count;
                _channels[channel].value += count;
              });

              var channels = Object.keys(_channels);
              var channelUsage = _.values(_channels);
              var timelineValues = _.map(_timeline, value => {
                channels.forEach(channel => {
                  if (!value[channel]) value[channel] = 0;
                });
                return value;
              });

              return {
                "timeline-users-graphData": timelineValues,
                "timeline-users-channelUsage": channelUsage,
                "timeline-users-timeFormat": (timespan === "24 hours" ? 'hour' : 'date'),
                "timeline-users-channels": channels
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
		}
	],
	elements: [
		{
			id: "scorecardAvgScore",
			type: "Scorecard",
			title: "Avg Score",
			size: { w: 1,h: 3 },
			dependencies: { value: "ai:avg-score-value",color: "ai:avg-score-color",icon: "ai:avg-score-icon" }
		},
		{
			id: "timeline_hits",
			type: "Timeline",
			title: "Hit Rate",
			subtitle: "How many questions were asked per timeframe",
			size: { w: 5,h: 8 },
			dependencies: { values: "ai:timeline-hits-graphData",lines: "ai:timeline-hits-channels",timeFormat: "ai:timeline-hits-timeFormat" }
		},
    {
			id: "channels",
			type: "PieData",
			title: "Channel Usage (Users)",
			subtitle: "Total users sent per channel",
			size: { w: 5,h: 8 },
			dependencies: { values: "ai:timeline-users-channelUsage" },
			props: { showLegend: false,compact: true }
		},
		{
			id: "scorecard_total_hits",
			type: "Scorecard",
			title: "Total hits",
			size: { w: 1,h: 3 },
			dependencies: { value: "ai:score-hits",color: "::#2196F3",icon: "::av_timer" }
		}
	],
	dialogs: []
}