return {
	id: "nfl_analytics",
	name: "NFL Analytics",
	icon: "equalizer",
	url: "nfl_analytics",
	description: "NFL Analytics Dashboard",
	preview: "/images/bot-framework-preview.png",
	config: {
		connections: {
			"application-insights": { appId: "32f4aed8-8450-41b8-baac-8191389a10ea",apiKey: "5qp7qfeksg1vb545tnmsagzg6gcqsszpa5ufrdes" }
		},
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
						calculated: (filterChannels) => {
              const filters = filterChannels.map((x) => x.channel);
              let { selectedValues } = filterChannels;
              if (selectedValues === undefined) {
                selectedValues = [];
              }
              return {
                "channels-count": filterChannels,
                "channels-filters": filters,
                "channels-selected": selectedValues,
              };
            }
					},
					filterIntents: {
						query: () => `
              extend intent=customDimensions.intent, cslen = customDimensions.callstack_length | 
              where name startswith 'message.intent' and (cslen == 0 or strlen(cslen) == 0) and strlen(intent) > 0 | 
              summarize intent_count=count() by tostring(intent) | 
              order by intent_count`,
						mappings: { intent: (val) => val || "unknown",intent_count: (val) => val || 0 },
						calculated: (filterIntents) => {
              const intents = filterIntents.map((x) => x.intent);
              let { selectedValues } = filterIntents;
              if (selectedValues === undefined) {
                selectedValues = [];
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
			id: "nfl",
			type: "ApplicationInsights/Query",
			dependencies: { timespan: "timespan",queryTimespan: "timespan:queryTimespan",granularity: "timespan:granularity" },
			params: {
				table: "telemetry_import",
				queries: {
					queries_per_session: {
						query: () => `
								where recordType == "intent" | 
								summarize count_queries=count() by bin(timestamp, 1d), userId | 
								summarize average=avg(count_queries) | 
								extend average=round(average, 1) `,
						calculated: (result) => {
							return {
								avg_queries_per_session: (result && result.length && result[0].average) || 0
							}
						}
					},
					total_users: {
						query: () => `
							where recordType == 'intent' |
							summarize dcount(userId) by userId |
							count`,
						calculated: (total_users) => {
							return {
								total_users: (total_users.length && total_users[0].Count) || 0
							}
						}
					},
					returning_users: {
						query: (dependencies) => {
							let { timespan } = dependencies;
							let threshold =
								timespan === '24 hours' ? '24h' :
								timespan === '1 week' ? '7d' :
								timespan === '1 month' ? '30d' : '90d';
							return `
								where recordType == 'intent' |
								summarize dcount(userId), minTimestamp=min(timestamp), maxTimestamp=max(timestamp) by userId |
								where minTimestamp < ago(${threshold}) and maxTimestamp > ago(${threshold}) |
								count`;
						},
						calculated: (returning_users) => {
							return {
								returning_users: (returning_users.length && returning_users[0].Count) || 0
							}
						}
					},
					timeline: {
						query: (dependencies) => {
							var { granularity } = dependencies;
							return `
								where recordType == 'intent' |						
								extend channel=substring(channelId, 0, 1) |
								summarize count=count() by bin(timestamp, ${granularity}), channel |
								order by timestamp asc`;
						},
						calculated: (timeline, dependencies) => {

							// Timeline handling
							// =================

							let _timeline = {};
							let _channels = {};
							let { timespan } = dependencies;

							/**
							 * Looping through all results building timeline format values
							 * Expected result:
							 * {
							 * 	timestampValue1: { channel1: count, channel2: count ... }
							 * 	timestampValue2: { channel1: count2, channel2: count2 ... }
							 * }
							 * 
							 * Channels result:
							 * { channel1_total: count, channel2_total: count ... }
							 */
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

							// Going over all the channels making sure that we add "0" count
							// For every timestamp on the timeline (for no value channels)
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
					"timeline-users": {
						query: (dependencies) => {
							var { granularity } = dependencies;
							return `
								where recordType == 'intent' |						
								extend userId=substring(userId, 0, 1), channelId=substring(channelId, 0, 1) |
								summarize count=dcount(userId) by bin(timestamp, ${granularity}), channel=channelId |
								order by timestamp asc`;
						},
						calculated: (timeline, dependencies) => {

							// Timeline handling
							// =================

							let _timeline = {};
							let _channels = {};
							let { timespan } = dependencies;

							/**
							 * Looping through all results building timeline format values
							 * Expected result:
							 * {
							 * 	timestampValue1: { channel1: count, channel2: count ... }
							 * 	timestampValue2: { channel1: count2, channel2: count2 ... }
							 * }
							 * 
							 * Channels result:
							 * { channel1_total: count, channel2_total: count ... }
							 */
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

							// Going over all the channels making sure that we add "0" count
							// For every timestamp on the timeline (for no value channels)
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
							` where recordType == "intent" |` +
							` summarize count_intents=count() by intentName |` +
							` extend intent=substring(intentName, 0, 4) |` +
							` order by count_intents `,
						calculated: (intents) => {
							return {
								"intents-bars": [ 'count_intents' ]
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
					users: {
						query: "summarize totalUsers=count() by user_Id",
						filters: [{ dependency: "selectedChannels",queryProperty: "customDimensions.channel" }],
						calculated: (users) => {
							let result = 0;
							if (users.length === 1 && users[0].totalUsers > 0) {
								result = users[0].totalUsers;
							}
							return {
								"users-value": result,
								"users-icon": 'account_circle'
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
				query: () => ` exceptions` +
            ` | summarize count_error=count() by handledAt, innermostMessage` +
            ` | order by count_error desc `,
				mappings: { handledAt: (val) => val || "Unknown",count: (val, row) => row.count_error }
			},
			calculated: (state) => {
        var { values } = state;

        if (!values || !values.length) { return; }

        var errors = values;
        var handlers = {};
        var handledAtTotal = 0;
        var handledAtUncaught = 0;
        errors.forEach(error => {
          if (!handlers[error.handledAt]) handlers[error.handledAt] = {
            name: error.handledAt,
            count: 0
          };
          handlers[error.handledAt].count += error.count;
          handledAtTotal += error.count;
          handledAtUncaught += (error.handledAt !== 'UserCode' ? error.count : 0);
        });

        return {
          errors,
          handlers: _.values(handlers),
          handledAtTotal,
          handledAtTotal_color: handledAtTotal > 0 ? '#D50000' : '#AEEA00',
					handledAtTotal_icon: handledAtTotal > 0 ? 'bug_report' : 'done',
          handledAtUncaught
        };
      }
		}
	],
	filters: [
		{
			type: "TextFilter",
			dependencies: { selectedValue: "timespan",values: "timespan:values" },
			actions: { onChange: "timespan:updateSelectedValue" },
			first: true
		},
		{
			type: "TextFilter",
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
			size: { w: 6,h: 8 },
			dependencies: {
				visible: "modes:messages",
				values: "nfl:timeline-graphData",
				lines: "nfl:timeline-channels",
				timeFormat: "nfl:timeline-timeFormat"
			}
		},
		{
			id: "timeline",
			type: "Timeline",
			title: "Users Rate",
			subtitle: "How many users were sent per timeframe",
			size: { w: 6,h: 8 },
			dependencies: {
				visible: "modes:users",
				values: "nfl:timeline-users-graphData",
				lines: "nfl:timeline-users-channels",
				timeFormat: "nfl:timeline-users-timeFormat"
			}
		},
		{
			id: "channels",
			type: "PieData",
			title: "Channel Usage",
			subtitle: "Total messages sent per channel",
			size: { w: 3,h: 8 },
			dependencies: { visible: "modes:messages",values: "nfl:timeline-channelUsage" },
			props: { showLegend: false,compact: true }
		},
		{
			id: "channels",
			type: "PieData",
			title: "Channel Usage (Users)",
			subtitle: "Total users sent per channel",
			size: { w: 3,h: 8 },
			dependencies: { visible: "modes:users",values: "nfl:timeline-users-channelUsage" },
			props: { showLegend: false,compact: true }
		},
		{
			id: "scores",
			type: "Scorecard",
			size: { w: 3,h: 6 },
			dependencies: {
				card_errors_value: "errors:handledAtTotal",
				card_errors_heading: "::Errors",
				card_errors_color: "errors:handledAtTotal_color",
				card_errors_icon: "errors:handledAtTotal_icon",
				card_errors_subvalue: "errors:handledAtTotal",
				card_errors_subheading: "::Avg",
				card_errors_className: "errors:handledAtTotal_class",
				card_errors_onClick: "::onErrorsClick",
				card_qps_value: "nfl:avg_queries_per_session",
				card_qps_heading: "::Q/Session",
				card_qps_color: "::#2196F3",
				card_qps_icon: "::av_timer",
				card_users_value: "nfl:total_users",
				card_users_heading: "::Unique Users",
				card_users_subvalue: "nfl:returning_users",
				card_users_subheading: "::Returning",
				card_users_icon: "::account_circle"
			},
			actions: {
				onErrorsClick: {
					action: "dialog:errors",
					params: { title: "args:heading",type: "args:type",innermostMessage: "args:innermostMessage",queryspan: "timespan:queryTimespan" }
				}
			}
		},
		{
			id: "intents",
			type: "BarData",
			title: "Intents Graph",
			subtitle: "Intents usage per time",
			size: { w: 7,h: 8 },
			dependencies: { values: "nfl:intents",bars: "nfl:intents-bars" },
			props: { nameKey: "intent",showLegend: false },
			actions: {
				onBarClick: {
					action: "dialog:intentsDialog",
					params: { title: "args:intentName",intent: "args:intentName",queryspan: "timespan:queryTimespan" }
				}
			}
		}
	],
	dialogs: [
		{
			id: "intentsDialog",
			width: "60%",
			params: ["title","intent","queryspan"],
			dataSources: [
				{
					id: "intentsDialog-data",
					type: "ApplicationInsights/Query",
					dependencies: { intent: "dialog_intentsDialog:intent",queryTimespan: "dialog_intentsDialog:queryspan" },
					params: {
						table: "telemetry_import",
						queries: {
							"total-conversations": {
								query: ({ intent }) => `
										where recordType == "intent" and intentName == '${intent}' |
										summarize count_intents=count(), maxTimestamp=max(timestamp) by conversationId`,
								calculated: (conversations) => {
									return {
										"total-conversations": (conversations && conversations.length) || 0
									}
								}
							},
							utterances: {
								query: ({ intent }) => `
										where recordType == "intent" and intentName == '${intent}' |
										summarize count_intents=count(), maxTimestamp=max(timestamp) by conversationId |
										order by maxTimestamp`,
								calculated: (utterances) => {
									return {
										"sample-utterances": [
											{
												intentName: 'Bla',
												utterance: "What was BLA doing with BLA in BLA?",
												count: 7
											},
											{
												intentName: 'Bla',
												utterance: "What was Kiki doing with Kuku in Koko?",
												count: 4
											},
											{
												intentName: 'Bla',
												utterance: "What should K do with K in K?",
												count: 4
											},
											{
												intentName: 'Bla',
												utterance: "K@K-K",
												count: 2
											},
											{
												intentName: 'Bla',
												utterance: "Does K and K work with K?",
												count: 1
											}
										],
										"sample-success-rate": [
											{
												type: "Success",
												percentage: "75%"
											},
											{
												type: "Failure",
												percentage: "10%"
											},
											{
												type: "Ambiguous",
												percentage: "15%"
											}
										],
										"sample-response-types": [
											{ name: "Disposition", success: 30, fail: 70 },
											{ name: "Quality", default: 65, ambiguous: 20, normal: 15 },
											{ name: "Type", card: 80, bubble: 20 },
											{ name: "Image", success: 80, fail: 20 },
											{ name: "Requests", "Logged In": 44, "Anonymous": 56 },
											{ name: "Cache", hits: 90, misses: 10 }
										],
										"sample-response-types-bars": [ 
											{ name: "success", color: "#00BFA5"}, { name: "fail", color: "#B71C1C" } , 
											{ name: "default", color: "#64FFDA" }, { name: "ambiguous", color: "#1DE9B6" }, { name: "normal", color: "#00BFA5" }, 
											{ name: "card", color: "#64FFDA" }, { name: "bubble", color: "#1DE9B6" }, 
											{ name: "Logged In", color: "#00BFA5" }, { name: "Anonymous", color: "#B71C1C" }, 
											{ name: "hits", color: "#00BFA5" }, { name: "misses", color: "#B71C1C" }
										],
										"sample-response-times_0": "100",
										"sample-response-times_1": "20",
										"sample-response-times_2": "7000000",
										"sample-response-times_3": "1500",
									};
								}
							},
							"entities-usage": {
								query: ({ intent }) => `where recordType == "entity" |
										summarize entity_count=count() by entityType, conversationId |
										summarize total_count=count() by entity_count, entityType |
										order by entityType, entity_count asc |
										where total_count <= 5 and entityType !startswith "kindNameValue"`,
								calculated: (entityUsage) => {

									let count_values = _.uniq(entityUsage.map(e => e.total_count));
									let barResults = {};

									let results = entityUsage.forEach(entity => {
										barResults[entity.entityType] = barResults[entity.entityType] || { entityType: entity.entityType };
										barResults[entity.entityType][entity.total_count] = entity.entity_count;
									});

									return {
										"entities-usage": _.values(barResults),
										"entities-usage-bars": count_values
									};
								}
							}
						}
					}
				}
			],
			elements: [
				{
					id: "conversations-count",
					type: "Scorecard",
					size: { w: 6,h: 2 },
					dependencies: {
						card_conversations_value: "intentsDialog-data:total-conversations",
						card_conversations_heading: "::Conversations",
						card_conversations_color: "::#2196F3",
						card_conversations_icon: "::chat",
						card_conversations_onClick: "::onConversationsClick",
						card_responseTimes0_value: "intentsDialog-data:sample-response-times_0",
						card_responseTimes0_heading: "::In <1 sec",
						card_responseTimes0_color: "::#82B1FF",
						card_responseTimes0_icon: "::av_timer",
						card_responseTimes1_value: "intentsDialog-data:sample-response-times_1",
						card_responseTimes1_heading: "::In <2 sec",
						card_responseTimes1_color: "::#448AFF",
						card_responseTimes1_icon: "::av_timer",
						card_responseTimes2_value: "intentsDialog-data:sample-response-times_2",
						card_responseTimes2_heading: "::In < 3 sec",
						card_responseTimes2_color: "::#2979FF",
						card_responseTimes2_icon: "::av_timer",
						card_responseTimes3_value: "intentsDialog-data:sample-response-times_3",
						card_responseTimes3_heading: "::In 3+",
						card_responseTimes3_color: "::#2962FF",
						card_responseTimes3_icon: "::av_timer"
					},
					actions: {
						onConversationsClick: {
							action: "dialog:conversations",
							params: { title: "dialog_intentsDialog:title",intent: "dialog_intentsDialog:intent",queryspan: "dialog_intentsDialog:queryspan" }
						}
					}
				},
				{
					id: "entity-usage",
					type: "BarData",
					title: "Entity count appearances in intent",
					subtitle: "Entity usage and count for the selected intent",
					size: { w: 3,h: 8 },
					location: { x: 0,y: 1 },
					dependencies: { values: "intentsDialog-data:entities-usage",bars: "intentsDialog-data:entities-usage-bars" },
					props: { nameKey: "entityType" }
				},
				{
					id: "response-statistics",
					type: "BarData",
					title: "Response Statistics",
					subtitle: "Entity usage and count for the selected intent",
					size: { w: 3,h: 8 },
					location: { x: 3,y: 1 },
					dependencies: { values: "intentsDialog-data:sample-response-types",bars: "intentsDialog-data:sample-response-types-bars" },
					props: { nameKey: "name" }
				}
			]
		},
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
						table: "telemetry_import",
						queries: {
							conversations: {
								query: ({ intent }) => `
										where recordType == "intent" and intentName == '${intent}' |
										summarize count_intents=count(), maxTimestamp=max(timestamp) by conversationId |
										order by maxTimestamp`,
								mappings: { id: (val, row, idx) => `Conversation ${idx}` }
							}
						}
					}
				}
			],
			elements: [
				{
					id: "conversations-list",
					type: "Table",
					title: "Conversations",
					size: { w: 12,h: 16 },
					dependencies: { values: "conversations-data:conversations" },
					props: {
						hideBorders: true,
						cols: [
							{ header: "Conversation Id",field: "id" },
							{ header: "Last Message",field: "maxTimestamp",type: "time",format: "MMM-DD HH:mm:ss" },
							{ header: "Count",field: "count_intents" },
							{ type: "button",value: "chat",click: "openMessagesDialog" }
						]
					},
					actions: {
						openMessagesDialog: {
							action: "dialog:messages",
							params: { title: "args:id",conversation: "args:conversationId",queryspan: "timespan:queryTimespan" }
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
		}
	]
}