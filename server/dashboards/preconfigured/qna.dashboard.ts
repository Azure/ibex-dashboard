/// <reference path="../../../src/types.d.ts"/>
import * as _ from 'lodash';

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
	id: "qna",
	name: "Sample QnA Maker dashboard",
	icon: "chat",
	url: "qna",
	description: "Sample QnA Maker dashboard",
	preview: "/images/bot-framework-preview.png",
	html: `<div>
    <h1>Sample QnA Maker dashboard</h1>
    <p>Displays QnA Maker service usage metrics.</p> 
    <h3><a href="https://qnamaker.ai" target="_blank">What's QnA Make Service?</a></h3>
    <h3>Requirements</h3>
    <p>To send the QnA Maker service data to Applications Insight it's necessary to use the <a href="https://www.npmjs.com/package/botbuilder-cognitiveservices" target="_blank">botbuilder-cognitiveservices</a> on the bot and override the
    <b>defaultWaitNextMessage(session, qnaMakerResult)</b> function to call the <b>trackQNAEvent(context, userQuery, kbQuestion, kbAnswer, score)</b> function of the 
    <a href="https://www.npmjs.com/package/botbuilder-instrumentation" target="_blank">botbuilder-instrumentation</a>
    <p>That will enable the bot to send additional telemetries to Application Insight with the QnA Maker service information
    </p>
    <p>
      <span>Refer to the </span>
      <span>
        <a href="https://github.com/CatalystCode/ibex-dashboard/blob/master/docs/bot-framework.md" target="_blank">
          bot-framework
        </a> docs for setup instructions.</span>
    </p>
  </div>`, // info about how to configure QnA and how to use botbuilder-instrumentation
	config: {
		connections: {},
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
                | where score > 0
                | summarize avg=bin(avg(score) * 100, 1) `,
						calculated: (avgscore) => {
              return { 
                'avg-score-value': avgscore[0].avg + '%',
                'avg-score-color': avgscore[0].avg >= 80 ? '#4caf50' : 
                                    (avgscore[0].avg > 60 ? '#FFc107' : '#F44336'),
                'avg-score-icon': avgscore[0].avg >= 80 ? 'sentiment_very_satisfied' : 
                                    (avgscore[0].avg > 60 ? 
                                      'sentiment_satisfied' : 
                                      'sentiment_dissatisfied')
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
						query: ({ granularity }) => `
                  where name == 'MBFEvent.QNAEvent'
                  | extend userName=tostring(customDimensions.userName)
                  | summarize count=dcount(userName) by bin(timestamp, ${granularity}),
                            name, channel=tostring(customDimensions.channel)
                  | order by timestamp asc
            `,
						mappings: { channel: (val) => val || "unknown" ,count: (val) => val || 0 },
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
					},
          questions: {
            query: () => `
              extend userQuery=tostring(customDimensions.userQuery),
                     question=tostring(customDimensions.kbQuestion),
                     kbAnswer=tostring(customDimensions.kbAnsert),
                     score=toint(customDimensions.score),
                     timestamp=tostring(timestamp)
              | where name=='MBFEvent.QNAEvent'
              | project timestamp , userQuery , question , kbAnswer , score
              | summarize counter=count(userQuery) by question
              | order by counter desc`,
            mappings: { question: val =>  val || "Unknown", counter: val => val || 0 },
            calculated: questions => ({"questions-bars": [ 'counter']})
          }
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
			id: "timeline_hits",
			type: "Timeline",
			title: "Hit Rate",
			subtitle: "How many questions were asked per timeframe",
			size: { w: 5,h: 8 },
			dependencies: { values: "ai:timeline-hits-graphData", lines: "ai:timeline-hits-channels",timeFormat: "ai:timeline-hits-timeFormat" }
		},
    {
			id: "channels",
			type: "PieData",
			title: "Channel Usage (Users)",
			subtitle: "Total users sent per channel",
			size: { w: 5,h: 8 },
			dependencies: { values: "ai:timeline-users-channelUsage" },
			props: { showLegend: true }
		},
    {
			id: "scorecardAvgScore",
			type: "Scorecard",
			title: "Avg Score",
			size: { w: 1,h: 3 },
			dependencies: { value: "ai:avg-score-value",color: "ai:avg-score-color",icon: "ai:avg-score-icon" }
		},
		{
			id: "scorecard_total_hits",
			type: "Scorecard",
			title: "Total hits",
			size: { w: 1,h: 3 },
			dependencies: { value: "ai:score-hits",color: "::#2196F3",icon: "::av_timer" }
		},
    {
      id: "qna_questions",
      type: "BarData",
      title: "QnA Graph",
      subtitle: "QnA hits per question",
      size: { w: 12,h: 8 },
      dependencies: { values: "ai:questions", bars: "ai:questions-bars" },
      props: { nameKey: "question" },
    }
	],
	dialogs: []
}