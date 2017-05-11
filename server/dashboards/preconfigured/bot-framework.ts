/// <reference path="../../../src/types.d.ts"/>
import * as _ from 'lodash'; 

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
  id: 'bot_analytics_dashboard',
  name: 'Bot Analytics Dashboard',
  icon: "dashboard",
	url: "bot_analytics_dashboard",
  description: 'Microsoft Bot Framework based analytics',
  preview: '/images/bot-framework-preview.png',
	html: `<div>
				<h1>Bot Analytics Dashboard</h1>
				<h2>Additional features</h2>
				<ul>
					<li>Modes
						<ul>
							<li>Allows fast switching between different views</li>
						</ul>
					</li>
				</ul>
        <h2>Background</h2>
        <p>
          This dashboard is designed to enable querying data on top of <a href="https://docs.microsoft.com/en-us/azure/application-insights/app-insights-analytics" target="_blank">Application Insights Analytics</a>.<br/>
          You can also extend it by developing additional <b>Data Sources</b> or <b>Visual Components</b>.
        </p>
        <br/>
        <h2>Telemetry plugin</h2>
        <p>
          To see all the capabilities of this dashboard, it is recommended to integrate you bot with one of the following:<br/>
          <a href="https://github.com/CatalystCode/bot-fmk-logging" target="_blank">Node.js Telemetry Plugin</a><br/>
          <a href="https://trpp24botsamples.visualstudio.com/_git/Code?path=%2FCSharp%2Fsample-Telemetry&amp;version=GBmaster&amp;_a=contents " target="_blank">C# Telemetry Plugin</a><br/>
          This will enable the bot to send additional telemetry information to Application Insights.
          <br/><br/>
          Keep in mind, the data that is stored on Application Insights is not Hippa compliant.
        </p>
        <br/>
        <h2>Additional Learnings</h2>
        <p>
          This dashboard uses <a href="https://docs.microsoft.com/en-us/azure/application-insights/app-insights-analytics" target="_blank">Application Insights Analytics</a>.<br/>
          You can also run queries directly using <a href="https://dev.applicationinsights.io/apiexplorer/query" target="_blank">API Explorer</a>
        </p>
      </div>`,
  config: {
    connections: { },
    layout: {
			isDraggable: true,
			isResizable: true,
			rowHeight: 30,
			verticalCompact: false,
			cols: {
				lg: 12,
				md: 10,
				sm: 6,
				xs: 4,
				xxs: 2
			},
			breakpoints: {
				lg: 1200,
				md: 996,
				sm: 768,
				xs: 480,
				xxs: 0
			},
			layouts: {
				lg: [{
						w: 5,
						h: 8,
						x: 0,
						y: 0,
						i: "timeline",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 3,
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
					},{
						w: 4,
						h: 3,
						x: 8,
						y: 0,
						i: "scores",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 8,
						x: 0,
						y: 8,
						i: "intents",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 8,
						x: 4,
						y: 8,
						i: "timeline-area",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 13,
						x: 8,
						y: 3,
						i: "scatter",
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
						w: 4,
						h: 8,
						x: 4,
						y: 8,
						i: "map",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					}],
				md: [{
						w: 5,
						h: 8,
						x: 0,
						y: 0,
						i: "timeline",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 3,
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
					},{
						w: 4,
						h: 3,
						x: 6,
						y: 8,
						i: "scores",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 8,
						x: 0,
						y: 8,
						i: "intents",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 8,
						x: 4,
						y: 24,
						i: "timeline-area",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 13,
						x: 6,
						y: 11,
						i: "scatter",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					}],
				sm: [{
						w: 4,
						h: 7,
						x: 0,
						y: 3,
						i: "timeline",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 8,
						x: 0,
						y: 10,
						i: "channels",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 3,
						x: 0,
						y: 0,
						i: "scores",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 8,
						x: 0,
						y: 31,
						i: "intents",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 8,
						x: 0,
						y: 39,
						i: "timeline-area",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 4,
						h: 13,
						x: 0,
						y: 18,
						i: "scatter",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					}],
				xxs: [{
						w: 2,
						h: 7,
						x: 0,
						y: 5,
						i: "timeline",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 2,
						h: 8,
						x: 0,
						y: 12,
						i: "channels",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 2,
						h: 5,
						x: 0,
						y: 0,
						i: "scores",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 2,
						h: 8,
						x: 0,
						y: 33,
						i: "intents",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 2,
						h: 8,
						x: 0,
						y: 41,
						i: "timeline-area",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					},{
						w: 2,
						h: 13,
						x: 0,
						y: 20,
						i: "scatter",
						minW: undefined,
						maxW: undefined,
						minH: undefined,
						maxH: undefined,
						moved: false,
						static: false,
						isDraggable: undefined,
						isResizable: undefined
					}]
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
			id: "modes",
			type: "Constant",
			params: { values: ["messages","users"],selectedValue: "messages" },
			calculated: (state, dependencies) => {
        let flags = {};
				flags['messages'] = (state.selectedValue === 'messages');
				flags['users'] 		= (state.selectedValue !== 'messages');
        return flags;
      }
		},
		{
			id: "filters",
			type: "ApplicationInsights/Query",
			dependencies: { timespan: "timespan",queryTimespan: "timespan:queryTimespan",granularity: "timespan:granularity" },
			params: {
				table: "customEvents",
				queries: {
					filterChannels: {
						query: () => `` +
              ` where name == 'Activity' | ` +
              ` extend channel=customDimensions.channel | ` +
              ` summarize channel_count=count() by tostring(channel) | ` +
              ` order by channel_count`,
						mappings: { channel: (val) => val || "unknown",channel_count: (val) => val || 0 },
						calculated: (filterChannels, dependencies, prevState) => {

              // This code is meant to fix the following scenario:
              // When "Timespan" filter changes, to "channels-selected" variable
              // is going to be reset into an empty set.
              // For this reason, using previous state to copy filter
              const filters = filterChannels.map((x) => x.channel);
              let selectedValues = [];
              if (prevState['channels-selected'] !== undefined) {
								selectedValues = prevState['channels-selected'];
							}
              return {
                "channels-count": filterChannels,
                "channels-filters": filters,
                "channels-selected": selectedValues,
              };
            }
					},
					filterIntents: {
						query: () => `` +
              ` extend intent=customDimensions.intent, cslen = customDimensions.callstack_length | ` +
              ` where name startswith 'message.intent' and (cslen == 0 or strlen(cslen) == 0) and strlen(intent) > 0 | ` +
              ` summarize intent_count=count() by tostring(intent) | ` +
              ` order by intent_count`,
						mappings: { intent: (val) => val || "unknown",intent_count: (val) => val || 0 },
						calculated: (filterIntents, dependencies, prevState) => {
              const intents = filterIntents.map((x) => x.intent);
              let selectedValues = [];
              if (prevState['intents-selected'] !== undefined) {
								selectedValues = prevState['intents-selected'];
							}
              return {
                "intents-count": filterIntents,
                "intents-filters": intents,
                "intents-selected": selectedValues,
              };
            }
					}
				}
			}
		},
		{
			id: "ai",
			type: "ApplicationInsights/Query",
			dependencies: {
				timespan: "timespan",
				queryTimespan: "timespan:queryTimespan",
				granularity: "timespan:granularity",
				selectedChannels: "filters:channels-selected",
				selectedIntents: "filters:intents-selected"
			},
			params: {
				table: "customEvents",
				queries: {
					conversions: {
						query: () => `` +
								` extend successful=customDimensions.successful | ` +
								` where name startswith 'message.convert' | ` +
								` summarize event_count=count() by name, tostring(successful)`,
						mappings: { successful: (val) => val === 'true',event_count: (val) => val || 0 },
						filters: [{ dependency: "selectedChannels",queryProperty: "customDimensions.channel" }],
						calculated: (conversions) => {

							// Conversion Handling
							// ===================

              let total, successful;
							total = _.find(conversions, { name: 'message.convert.start' });
							successful = _.find(conversions, { name: 'message.convert.end', successful: true }) || { event_count: 0 };

							if (!total) {
								return null;
							}

							var displayValues = [
								{ label: 'Successful', count: successful.event_count }, 
								{ label: 'Failed', count: total.event_count - successful.event_count + 5 }, 
							];

							let conversionRate = (100 * total.event_count / (successful.event_count + 5)).toFixed(1); 

							return {
								"conversions-displayValues": displayValues,
								"conversions-rate": conversionRate + '%',
							};
						}
					},
					timeline: {
						query: (dependencies) => {
							var { granularity } = dependencies;
							return `` +
								` where name == 'Activity' | ` +
								` summarize count=count() by bin(timestamp, ${granularity}), name, channel=tostring(customDimensions.channel) | ` +
								` order by timestamp asc `
						},
						mappings: { channel: (val) => val || "unknown",count: (val) => val || 0 },
						filters: [{ dependency: "selectedChannels",queryProperty: "customDimensions.channel" }],
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
								"timeline-graphData": timelineValues,
								"timeline-channelUsage": channelUsage,
								"timeline-timeFormat": (timespan === "24 hours" ? 'hour' : 'date'),
								"timeline-channels": channels
							};
						}
					},
					users_timeline: {
						query: (dependencies) => {
							var { granularity } = dependencies;
							return `` +
                  ` where name == 'Activity' |` +
                  ` summarize count=dcount(tostring(customDimensions.from)) by bin(timestamp, ${granularity}), name, channel=tostring(customDimensions.channel) |` +
                  ` order by timestamp asc`
						},
						mappings: { channel: (val) => val || "unknown",count: (val) => val || 0 },
						filters: [{ dependency: "selectedChannels",queryProperty: "customDimensions.channel" }],
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
					intents: {
						query: () => `` +
              ` extend cslen = customDimensions.callstack_length, intent=customDimensions.intent | ` +
              ` where name startswith "message.intent" and (cslen == 0 or strlen(cslen) == 0) and strlen(intent) > 0 | ` +
              ` summarize count=count() by tostring(intent)`,
						mappings: { intent: (val) => val || "Unknown",count: (val) => val || 0 },
						filters: [{ dependency: "selectedIntents",queryProperty: "customDimensions.intent" }],
						calculated: (intents) => {
							return {
								"intents-bars": [ 'count' ]
							};
						}
					},
					users: {
            query: `summarize totalUsers=count() by user_Id`,
            filters: [{
              dependency: "selectedChannels",
              queryProperty: "customDimensions.channel"
            }],
						calculated: (users) => {
							let result = 0;
							if (users.length === 1 && users[0].totalUsers > 0) {
								result = users[0].totalUsers;
							}
							return { "users-value": result };
						}
          },
					channelActivity: {
						query: () => `` + 
                    ` where name == 'Activity' | ` + 
                    ` extend channel=customDimensions.channel | ` + 
                    ` extend hourOfDay=floor(timestamp % 1d, 1h) / 1hr | ` + 
                    ` extend duration=tolong(customMeasurements.duration/1000) | ` + 
                    ` summarize count=count() by tolong(duration), tostring(channel), hourOfDay | ` + 
                    ` order by hourOfDay asc`,
						mappings: { duration: (val) => val || 0,channel: (val) => val || 'unknown' },
						filters: [{ dependency: "selectedChannels",queryProperty: "customDimensions.channel" }],
						calculated: (channelActivity) => {
							var groupedValues = _.chain(channelActivity).groupBy('channel').value();
							return {
								"channelActivity-groupedValues": groupedValues
							};
						}
					},
					mapActivity: {
						query: () => `` +
                    ` extend city=client_City, region=client_CountryOrRegion | ` + 
                    ` extend location=strcat(client_City, ', ', client_CountryOrRegion) | ` + 
                    ` summarize location_count=count() by region, city, location | ` +
                    ` order by region, location_count `,
						mappings: {
							region: (val) => val || 'unknown',
							city: (val) => val || 'unknown',
							location: (val) => val || 'unknown',
							location_count: (val) => val || 0
						},
						filters: [{ dependency: "selectedChannels",queryProperty: "customDimensions.channel" }],
						calculated: (mapActivity) => {
							return {
								"mapActivity-locations": mapActivity
							};
						}
					},
					sentiments: {
						query: () => `` +
									` extend score=customDimensions.score, text=customDimensions.text | ` +
									` where name startswith 'message.sentiment' | ` +
									` summarize sentiment=avg(todouble(score))`,
						calculated: (sentiments) => {

							if (!sentiments || !sentiments.length || isNaN(sentiments[0].sentiment)) { return null; }

							var values = [
								{ name: 'Positive', value: Math.round(sentiments[0].sentiment * 100) },
								{ name: 'Negative', value: Math.round((1 - sentiments[0].sentiment) * 100) },
							];

							let sentimentValue;
              sentimentValue = (sentiments[0].sentiment * 100).toFixed(1);

							return {
								"sentiment-value": values,
								"sentiment-height": sentimentValue + '%',
								"sentiment-color": sentimentValue > 60 ? '#AEEA00' : sentimentValue < 40 ? '#D50000' : '#FF9810',
								"sentiment-icon": sentimentValue > 60 ? 'sentiment_satisfied' : sentimentValue < 40 ? 'sentiment_dissatisfied' : 'sentiment_neutral',
								"sentiment-subvalue": "",
								"sentiment-subheading" : sentimentValue > 60 ? 'Positive' : sentimentValue < 40 ? 'Negative' : 'Neutral'
							};
						}
					}
				}
			}
		},
		{
			id: "errors",
			type: "ApplicationInsights/Query",
			dependencies: { timespan: "timespan",queryTimespan: "timespan:queryTimespan" },
			params: {
				query: () => ` 
            exceptions
            | summarize count_error=count() by type, innermostMessage
            | order by count_error desc `
			},
			calculated: (state) => {
        var { values } = state;

        if (!values || !values.length) { 
          return {
            typesTotal: 0,
            typesTotal_color: '#AEEA00',
            typesTotal_icon: 'done'
          };
        }

        var errors = values;
        var types = {};
        var typesTotal = 0;
        errors.forEach(error => {
          if (!types[error.type]) types[error.type] = {
            name: error.type,
            count: 0
          };
          types[error.type].count += error.count_error;
          typesTotal += error.count_error;
        });

        return {
          errors,
          types: _.values(types),
          typesTotal,
          typesTotal_color: typesTotal > 0 ? '#D50000' : '#AEEA00',
					typesTotal_icon: typesTotal > 0 ? 'bug_report' : 'done'
        };
      }
		},
    {
      id: "retention",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", selectedTimespan: "timespan:queryTimespan", queryTimespan: "::P90D" },
      params: {
        query: () => `
          customEvents |
          extend uniqueUser=tostring(customDimensions.from) |
          summarize oldestVisit=min(timestamp), lastVisit=max(timestamp) by uniqueUser |
          summarize
                  totalUnique = dcount(uniqueUser),
                  totalUniqueUsersIn24hr = countif(lastVisit > ago(24hr)),
                  totalUniqueUsersIn7d = countif(lastVisit > ago(7d)),
                  totalUniqueUsersIn30d = countif(lastVisit > ago(30d)),
                  returning24hr = countif(lastVisit > ago(24hr) and oldestVisit <= ago(24hr)),
                  returning7d = countif(lastVisit > ago(7d) and oldestVisit <= ago(7d)),
                  returning30d = countif(lastVisit > ago(30d) and oldestVisit <= ago(30d))
        `
      },
      calculated: ({ values }, { selectedTimespan }) => {

        let result = {
          totalUnique: 0,
          totalUniqueUsersIn24hr: 0,
          totalUniqueUsersIn7d: 0,
          totalUniqueUsersIn30d: 0,
          returning24hr: 0,
          returning7d: 0,
          returning30d: 0,

          total: 0,
          returning: 0,
          values: []
        };

        if (values && values.length) {
          _.extend(result, values[0]);
        }

        switch (selectedTimespan) {
          case 'PT24H':
            result.total = result.totalUniqueUsersIn24hr;
            result.returning = result.returning24hr;
            break;

          case 'P7D':
            result.total = result.totalUniqueUsersIn7d;
            result.returning = result.returning7d;
            break;

          case 'P30D':
            result.total = result.totalUniqueUsersIn30d;
            result.returning = result.returning30d;
            break;
        }

        result.values = [
          { 
            timespan: '24 hours', 
            retention: Math.round(100 * result.returning24hr / result.totalUniqueUsersIn24hr || 0) + '%',
            returning: result.returning24hr,
            unique: result.totalUniqueUsersIn24hr 
          },
          { 
            timespan: '7 days', 
            retention: Math.round(100 * result.returning7d / result.totalUniqueUsersIn7d || 0) + '%',
            returning: result.returning7d,
            unique: result.totalUniqueUsersIn7d
          },
          { 
            timespan: '30 days', 
            retention: Math.round(100 * result.returning30d / result.totalUniqueUsersIn30d || 0) + '%',
            returning: result.returning30d,
            unique: result.totalUniqueUsersIn30d
          },
        ];

        return result;
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
		{
			type: "TextFilter",
			title: "Mode",
			dependencies: { selectedValue: "modes",values: "modes:values" },
			actions: { onChange: "modes:updateSelectedValue" },
			first: true
		},
		{
			type: "MenuFilter",
			title: "Channels",
			subtitle: "Select channels",
			icon: "forum",
			dependencies: { selectedValues: "filters:channels-selected",values: "filters:channels-filters" },
			actions: { onChange: "filters:updateSelectedValues:channels-selected" },
			first: true
		},
		{
			type: "MenuFilter",
			title: "Intents",
			subtitle: "Select intents",
			icon: "textsms",
			dependencies: { selectedValues: "filters:intents-selected",values: "filters:intents-filters" },
			actions: { onChange: "filters:updateSelectedValues:intents-selected" },
			first: true
		}
	],
	elements: [
		{
			id: "timeline",
			type: "Timeline",
			title: "Message Rate",
			subtitle: "How many messages were sent per timeframe",
			size: { w: 5,h: 8 },
			dependencies: {
				visible: "modes:messages",
				values: "ai:timeline-graphData",
				lines: "ai:timeline-channels",
				timeFormat: "ai:timeline-timeFormat"
			}
		},
		{
			id: "timeline",
			type: "Timeline",
			title: "Users Rate",
			subtitle: "How many users were sent per timeframe",
			size: { w: 5,h: 8 },
			dependencies: {
				visible: "modes:users",
				values: "ai:timeline-users-graphData",
				lines: "ai:timeline-users-channels",
				timeFormat: "ai:timeline-users-timeFormat"
			}
		},
		{
			id: "channels",
			type: "PieData",
			title: "Channel Usage",
			subtitle: "Total messages sent per channel",
			size: { w: 3,h: 8 },
			dependencies: { visible: "modes:messages",values: "ai:timeline-channelUsage" },
			props: { showLegend: false,compact: true }
		},
		{
			id: "channels",
			type: "PieData",
			title: "Channel Usage (Users)",
			subtitle: "Total users sent per channel",
			size: { w: 3,h: 8 },
			dependencies: { visible: "modes:users",values: "ai:timeline-users-channelUsage" },
			props: { showLegend: false,compact: true }
		},
		{
			id: "scores",
			type: "Scorecard",
			size: { w: 4,h: 3 },
			dependencies: {
				card_errors_value: "errors:typesTotal",
				card_errors_heading: "::Errors",
				card_errors_color: "errors:typesTotal_color",
				card_errors_icon: "errors:typesTotal_icon",
				card_errors_subvalue: "errors:typesTotal",
				card_errors_subheading: "::Avg",
				card_errors_onClick: "::onErrorsClick",

				card_sentiment_value: "ai:sentiment-height",
				card_sentiment_heading: "::Sentiment",
				card_sentiment_color: "ai:sentiment-color",
				card_sentiment_icon: "ai:sentiment-icon",
				card_sentiment_subvalue: "ai:sentiment-subvalue",
				card_sentiment_subheading: "ai:sentiment-subheading",

				card_users_value: "retention:total",
				card_users_heading: "::Unique Users",
				card_users_icon: "::account_circle",
				card_users_subvalue: "retention:returning",
				card_users_subheading: "::Returning",
				card_users_onClick: "::onUsersClick",

				card_conversions_value: "ai:conversions-rate",
				card_conversions_heading: "::Conversions",
				card_conversions_icon: "::input",
				card_conversions_color: "::#2196F3"
			},
			actions: {
				onErrorsClick: {
					action: "dialog:errors",
					params: { title: "args:heading",type: "args:type",innermostMessage: "args:innermostMessage",queryspan: "timespan:queryTimespan" }
				},
				onUsersClick: {
					action: "dialog:userRetention",
					params: { title: "args:heading", queryspan: "::P90D" }
				}
			}
		},
		{
			id: "intents",
			type: "BarData",
			title: "Intents Graph",
			subtitle: "Intents usage per time",
			size: { w: 4,h: 8 },
			dependencies: { values: "ai:intents",bars: "ai:intents-bars" },
			props: { nameKey: "intent" },
			actions: {
				onBarClick: { action: "dialog:conversations",params: { title: "args:intent",intent: "args:intent",queryspan: "timespan:queryTimespan" } }
			}
		},
		{
			id: "timeline-area",
			type: "Area",
			title: "Message Rate",
			subtitle: "How many messages were sent per timeframe",
			size: { w: 4,h: 8 },
			dependencies: { values: "ai:timeline-graphData",lines: "ai:timeline-channels",timeFormat: "ai:timeline-timeFormat" },
			props: { isStacked: true,showLegend: false }
		},
		{
			id: "map",
			type: "MapData",
			title: "Map Activity",
			subtitle: "Monitor regional activity",
			size: { w: 4,h: 13 },
      location: { x: 9, y: 1 },
			dependencies: { locations: "ai:mapActivity-locations" },
			props: { mapProps: { zoom: 1,maxZoom: 6 } }
		}
	],
	dialogs: [
		{
			id: "conversations",
			width: "60%",
			params: ["title","intent","queryspan"],
			dataSources: [
				{
					id: "conversations-data",
					type: "ApplicationInsights/Query",
					dependencies: { intent: "dialog_conversations:intent",queryTimespan: "dialog_conversations:queryspan" },
					params: {
						query: ({ intent }) => ` customEvents` +
            ` | extend conversation = customDimensions.conversationId, intent=customDimensions.intent` +
            ` | where name startswith "message.intent" and intent =~ '${intent}'` +
            ` | summarize count=count(), maxTimestamp=max(timestamp) by tostring(conversation)` +
            ` | order by maxTimestamp`,
						mappings: { id: (val, row, idx) => `Conversation ${idx}` }
					}
				}
			],
			elements: [
				{
					id: "conversations-list",
					type: "Table",
					title: "Conversations",
					size: { w: 12,h: 16 },
					dependencies: { values: "conversations-data" },
					props: {
						cols: [
							{ header: "Conversation Id",field: "id" },
							{ header: "Last Message",field: "maxTimestamp",type: "time",format: "MMM-DD HH:mm:ss" },
							{ header: "Count",field: "count" },
							{ type: "button",value: "chat",click: "openMessagesDialog" }
						]
					},
					actions: {
						openMessagesDialog: {
							action: "dialog:messages",
							params: { title: "args:id",conversation: "args:conversation",queryspan: "timespan:queryTimespan" }
						}
					}
				}
			]
		},
		{
			id: "messages",
			width: "50%",
			params: ["title","conversation","queryspan"],
			dataSources: [
				{
					id: "messages-data",
					type: "ApplicationInsights/Query",
					dependencies: { conversation: "dialog_messages:conversation",queryTimespan: "dialog_messages:queryspan" },
					params: {
						query: ({ conversation }) => ` customEvents` +
              ` | extend conversation = customDimensions.conversationId, intent=customDimensions.intent` +
              ` | where name in ("message.send", "message.received") and conversation == '${conversation}'` +
              ` | order by timestamp asc` +
              ` | project timestamp, eventName=name, message=customDimensions.text, customDimensions.userName, customDimensions.userId`
					}
				}
			],
			elements: [
				{
					id: "messages-list",
					type: "Table",
					title: "Messages",
					size: { w: 12,h: 16 },
					dependencies: { values: "messages-data" },
					props: {
						rowClassNameField: "eventName",
						cols: [
							{ header: "Timestamp",width: "50px",field: "timestamp",type: "time",format: "MMM-DD HH:mm:ss" },
							{ header: "Message",field: "message" }
						]
					}
				}
			]
		},
		{
			id: "errors",
			width: "90%",
			params: ["title","queryspan"],
			dataSources: [
				{
					id: "errors-group",
					type: "ApplicationInsights/Query",
					dependencies: { queryTimespan: "dialog_errors:queryspan" },
					params: {
						query: () => ` exceptions` +
            ` | summarize error_count=count() by type, innermostMessage` +
            ` | project type, innermostMessage, error_count` +
            ` | order by error_count desc `
					},
					calculated: (state) => {
          const { values } = state;
          return {
            groups: values
          };
        }
				},
				{
					id: "errors-selection",
					type: "ApplicationInsights/Query",
					dependencies: { queryTimespan: "dialog_errors:queryspan",type: "args:type",innermostMessage: "args:innermostMessage" },
					params: {
						query: ({ type, innermostMessage }) => ` exceptions` +
            ` | where type == '${type}'` +
            ` | where innermostMessage == "${innermostMessage}"` +
            ` | extend conversationId=customDimensions["Conversation ID"]` +
            ` | project type, innermostMessage, handledAt, conversationId, operation_Id`
					}
				}
			],
			elements: [
				{
					id: "errors-list",
					type: "SplitPanel",
					title: "Errors",
					size: { w: 12,h: 16 },
					dependencies: { groups: "errors-group",values: "errors-selection" },
					props: {
						cols: [
							{ header: "Type",field: "type",secondaryHeader: "Message",secondaryField: "innermostMessage" },
							{ header: "Conversation Id",field: "conversationId",secondaryHeader: "Operation Id",secondaryField: "operation_Id" },
							{ header: "HandledAt",field: "handledAt" },
							{ type: "button",value: "more",click: "openErrorDetail" }
						],
						group: { field: "type",secondaryField: "innermostMessage",countField: "error_count" }
					},
					actions: {
						select: {
							action: "errors-selection:updateDependencies",
							params: { title: "args:type",type: "args:type",innermostMessage: "args:innermostMessage",queryspan: "timespan:queryTimespan" }
						},
						openErrorDetail: {
							action: "dialog:errordetail",
							params: {
								title: "args:operation_Id",
								type: "args:type",
								innermostMessage: "args:innermostMessage",
								handledAt: "args:handledAt",
								conversationId: "args:conversationId",
								operation_Id: "args:operation_Id",
								queryspan: "timespan:queryTimespan"
							}
						}
					}
				}
			]
		},
		{
			id: "errordetail",
			width: "50%",
			params: ["title","handledAt","type","operation_Id","queryspan"],
			dataSources: [
				{
					id: "errordetail-data",
					type: "ApplicationInsights/Query",
					dependencies: { operation_Id: "dialog_errordetail:operation_Id",queryTimespan: "dialog_errordetail:queryspan" },
					params: {
						query: ({ operation_Id }) => ` exceptions` +
            ` | where operation_Id == '${operation_Id}'` +
            ` | extend conversationId=customDimensions["Conversation ID"]` +
            ` | project handledAt, type, innermostMessage, conversationId, operation_Id, timestamp, details `
					}
				}
			],
			elements: [
				{
					id: "errordetail-item",
					type: "Detail",
					title: "Error detail",
					size: { w: 12,h: 16 },
					dependencies: { values: "errordetail-data" },
					props: {
						cols: [
							{ header: "Handle",field: "handledAt" },
							{ header: "Type",field: "type" },
							{ header: "Message",field: "innermostMessage" },
							{ header: "Conversation ID",field: "conversationId" },
							{ header: "Operation ID",field: "operation_Id" },
							{ header: "Timestamp",field: "timestamp" },
							{ header: "Details",field: "details" }
						]
					}
				}
			]
		},
    {
			id: "userRetention",
			width: "50%",
			params: ["title", "queryspan"],
			dataSources: [ ],
			elements: [{
					id: "user-retention-table",
					type: "Table",
					title: "User Retention",
					size: { w: 12, h: 16 },
					dependencies: { values: "retention" },
					props: {
						cols: [
              { header: "Time Span", field: "timespan" },
              { header: "Retention", field: "retention" },
              { header: "Returning", field: "returning" },
              { header: "Unique Users", field: "unique" }
            ]
					}
				}]
		}
	]
}