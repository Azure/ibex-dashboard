/// <reference path="../../../client/@types/types.d.ts"/>
import * as _ from 'lodash';

// The following line is important to keep in that format so it can be rendered into the page
export const config: IDashboardConfig = /*return*/ {
  id: "app_insights_web",
  featured: true,
  name: "Application Insights Web Application",
  icon: "dashboard",
  url: "app_insights_web",
  description: "Dashboard to monitor web apps",
  preview: "/images/application-insights.png",
  category: "Web Apps",
  html: `<div>
      This is Application Insights dashboard for web apps.</br>
      This dashboard is built to view all data that is sent to Application Insights like requests,
      dependencies, exceptions, custom events etc..
    </div>`,
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
          duration: {
            query: ({ granularity }) => {
              return `
               where duration > 0 |
               summarize avg_duration= round(avg(duration) / 1000, 1) by bin(timestamp, ${granularity}) |
               order by timestamp asc 
              `
            },
            format: { type: "timeline", args: { timeField: "timestamp", valueField: "avg_duration" } }
          },
          serverrequests: {
            query: ({ granularity }) => {
              return `
                summarize sum = sum(itemCount) by bin(timestamp, ${granularity}), success |
                order by timestamp asc 
              `
            },
            format: {
              type: "bars",
              args: { barsField: "timestamp", seriesField: "success", valueField: "sum", threshold: 1 }
            }
          }
        }
      }
    },
    {
      id: "exceptions",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan", granularity: "timespan:granularity" },
      params: {
        table: "exceptions",
        queries: {
          type: {
            query: ({ granularity }) => {
              return `summarize count = count() by type 
            `
            },
            format: { type: "pie", args: { value: "count", label: "type", maxLength: 20 } }
          },
          mapActivity: {
            query: () => `
              extend location=strcat(client_City, ', ', client_CountryOrRegion) |
              summarize location_count=count() by location |
              extend popup=strcat('<b>', location, '</b><br />', location_count, ' exceptions')
            `
          },
          count: {
            query: () => ` summarize count = count() `,
            format: {
              type: "scorecard",
              args: {
                countField: "count",
                thresholds: [{ value: 0, color: "#2196F3", icon: "bug_report", heading: "Exceptions" }]
              }
            }
          },
        }
      }
    },
    {
      id: "customEvents",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan", granularity: "timespan:granularity" },
      params: {
        table: "customEvents",
        queries: {
          usercount: {
            query: () => ` summarize count = dcount(user_Id) `,
            format: {
              type: "scorecard",
              args: {
                countField: "count",
                thresholds: [{ value: 0, color: "#2196F3", icon: "account_circle", heading: "Users" }]
              }
            }
          }
        }
      }
    },
    {
      id: "traces",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan", granularity: "timespan:granularity" },
      params: {
        table: "traces",
        queries: {
          count: {
            query: () => ` summarize count = count() `,
            format: {
              type: "scorecard",
              args: {
                countField: "count",
                thresholds: [{ value: 0, color: "#2196F3", icon: "format_align_justify", heading: "Traces" }]
              }
            }
          },
          top: {
            query: () => `
              project timestamp , message | 
              order by timestamp desc | 
              take 10 
            `
          }
        }
      }
    },
    {
      id: "dependencies",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan", granularity: "timespan:granularity" },
      params: {
        table: "dependencies",
        queries: {
          sum: {
            query: ({ granularity }) => {
              return `
                summarize sum = sum(itemCount) by bin(timestamp, ${granularity}), name |
                order by timestamp asc 
              `
            },
            format: {
              type: "bars",
              args: { barsField: "timestamp", seriesField: "name", valueField: "sum", threshold: 1 }
            }
          },
          count: {
            query: () => ` summarize count = count() `,
            format: {
              type: "scorecard",
              args: {
                countField: "count",
                thresholds: [{ value: 0, color: "#2196F3", icon: "input", heading: "Dependencies" }]
              }
            }
          },
          top: {
            query: () => ` 
              project timestamp , target, data | 
              order by timestamp desc | 
              take 10 
            `
          }
        }
      }
    },
    {
      id: "retention",
      type: "ApplicationInsights/Query",
      dependencies: { timespan: "timespan", selectedTimespan: "timespan:queryTimespan", queryTimespan: "::P90D" },
      format: "retention",
      params: {
        query: () => `
          customEvents |
          summarize oldestVisit=min(timestamp), lastVisit=max(timestamp) by user_Id |
          summarize
                  totalUnique = dcount(user_Id),
                  totalUniqueUsersIn24hr = countif(lastVisit > ago(24hr)),
                  totalUniqueUsersIn7d = countif(lastVisit > ago(7d)),
                  totalUniqueUsersIn30d = countif(lastVisit > ago(30d)),
                  returning24hr = countif(lastVisit > ago(24hr) and oldestVisit <= ago(24hr)),
                  returning7d = countif(lastVisit > ago(7d) and oldestVisit <= ago(7d)),
                  returning30d = countif(lastVisit > ago(30d) and oldestVisit <= ago(30d))
        `
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
    }
  ],
  elements: [
    {
      id: "serverResponseTime",
      type: "Timeline",
      title: "Server response time (sec)",
      subtitle: "Time between receiving HTTP request and finishing sending the response",
      size: { w: 4, h: 8 },
      source: "requests:duration"
    },
    {
      id: "serverRequests",
      type: "BarData",
      title: "Server requests by success",
      subtitle: "Requests count",
      size: { w: 4, h: 8 },
      source: "requests:serverrequests"
    },
    {
      id: "scores",
      type: "Scorecard",
      size: { w: 4, h: 3 },
      source: {
        users: "customEvents:usercount",
        traces: "traces:count",
        dependencies: "dependencies:count",
        exceptions: "exceptions:count"
      },
      dependencies: {
        card_users_onClick: "::onUsers",
        card_traces_onClick: "::onTraces",
        card_dependencies_onClick: "::onDependencies",
        card_exceptions_onClick: "::onExceptions"
      },
      actions: {
        onUsers: {
          action: "dialog:userRetention",
          params: { title: "args:heading", queryspan: "timespan:queryTimespan" }
        },
        onTraces: { action: "dialog:tracesview", params: { title: "args:heading", queryspan: "timespan:queryTimespan" } },
        onDependencies: {
          action: "dialog:dependenciesview",
          params: { title: "args:heading", queryspan: "timespan:queryTimespan" }
        },
        onExceptions: {
          action: "dialog:errors",
          params: {
            title: "args:heading",
            type: "args:type",
            innermostMessage: "args:innermostMessage",
            queryspan: "timespan:queryTimespan"
          }
        }
      }
    },
    {
      id: "exceptionType",
      type: "PieData",
      title: "Exception Type",
      subtitle: "Exceptions type",
      size: { w: 4, h: 8 },
      source: "exceptions:type",
      props: { entityType: "Type" }
    },
    {
      id: "dependenciescount",
      type: "BarData",
      title: "Dependencies",
      subtitle: "Dependencies sum by type",
      size: { w: 4, h: 8 },
      source: "dependencies:sum"
    },
    {
      id: "map",
      type: "MapData",
      title: "Exceptions Map",
      subtitle: "Monitor regional activity",
      size: { w: 4, h: 13 },
      location: { x: 9, y: 1 },
      source: "exceptions:mapActivity",
      props: { mapProps: { zoom: 1, maxZoom: 6 }, searchLocations: true }
    }
  ],
  dialogs: [
    {
      id: "userRetention",
      width: "50%",
      params: ["title", "queryspan"],
      dataSources: [
        {
          id: "ai-ur",
          type: "ApplicationInsights/Query",
          dependencies: { timespan: "timespan", queryTimespan: "timespan:queryTimespan", granularity: "timespan:granularity" },
          params: {
            table: "customEvents",
            queries: {
              retention_top_users: {
                query: () => `
                  summarize user_count=count() by user_Id |
                  top 5 by user_count 
                `
              }
            }
          }
        }
      ],
      elements: [
        {
          id: "user-retention-table",
          type: "Table",
          title: "User Retention",
          size: { w: 3, h: 9 },
          dependencies: { values: "retention" },
          props: {
            compact: true,
            cols: [
              { header: "Time Span", field: "timespan" },
              { header: "Retention", field: "retention" },
              { header: "Returning", field: "returning" },
              { header: "Unique Users", field: "unique" }
            ]
          }
        },
        {
          id: "top-users-table",
          type: "Table",
          title: "Top Users",
          size: { w: 3, h: 9 },
          dependencies: { values: "ai-ur:retention_top_users" },
          props: {
            compact: true,
            cols: [{ header: "User Id", field: "user_Id" }, { header: "Count", field: "user_count" }]
          }
        }
      ]
    },
    {
      id: "tracesview",
      dataSources: [],
      params: [],
      elements: [
        {
          id: "top-traces",
          type: "Table",
          title: "Latests traces",
          size: { w: 12, h: 9 },
          dependencies: { values: "traces:top" },
          props: {
            compact: true,
            cols: [{ header: "Timestamp", width: "10px", field: "timestamp" }, { header: "Message", field: "message" }]
          }
        }
      ]
    },
    {
      id: "dependenciesview",
      dataSources: [],
      params: [],
      elements: [
        {
          id: "top-dependencies",
          type: "Table",
          title: "Latests dependencies",
          size: { w: 12, h: 9 },
          dependencies: { values: "dependencies:top" },
          props: {
            compact: true,
            cols: [
              { header: "Timestamp", width: "10px", field: "timestamp" },
              { header: "Target", width: "10px", field: "target" },
              { header: "Data", field: "data" }
            ]
          }
        }
      ]
    },
    {
      id: "errors",
      width: "90%",
      params: ["title", "queryspan"],
      dataSources: [
        {
          id: "errors-group",
          type: "ApplicationInsights/Query",
          dependencies: { queryTimespan: "dialog_errors:queryspan" },
          params: {
            query: () => ` 
              exceptions |
              summarize error_count=count() by type, innermostMessage |
              project type, innermostMessage, error_count |
              order by error_count desc `
          }
        },
        {
          id: "errors-selection",
          type: "ApplicationInsights/Query",
          dependencies: {
            queryTimespan: "dialog_errors:queryspan",
            type: "args:type",
            innermostMessage: "args:innermostMessage"
          },
          params: {
            query: ({ type, innermostMessage }) => `
              exceptions |
              where type == '${type}' |
              where innermostMessage == "${innermostMessage}" |
              project type, innermostMessage, handledAt, operation_Id 
            `
          }
        }
      ],
      elements: [
        {
          id: "errors-list",
          type: "SplitPanel",
          title: "Errors",
          size: { w: 12, h: 16 },
          dependencies: { groups: "errors-group", values: "errors-selection" },
          props: {
            cols: [
              { header: "Type", field: "type", secondaryHeader: "Message", secondaryField: "innermostMessage" },
              { header: "Operation Id", field: "operation_Id" },
              { header: "HandledAt", field: "handledAt" },
              { type: "button", value: "more", click: "openErrorDetail" }
            ],
            group: { field: "type", secondaryField: "innermostMessage", countField: "error_count" }
          },
          actions: {
            select: {
              action: "errors-selection:updateDependencies",
              params: {
                title: "args:type",
                type: "args:type",
                innermostMessage: "args:innermostMessage",
                queryspan: "timespan:queryTimespan"
              }
            },
            openErrorDetail: {
              action: "dialog:errordetail",
              params: {
                title: "args:operation_Id",
                type: "args:type",
                innermostMessage: "args:innermostMessage",
                handledAt: "args:handledAt",
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
      params: ["title", "handledAt", "type", "operation_Id", "queryspan"],
      dataSources: [
        {
          id: "errordetail-data",
          type: "ApplicationInsights/Query",
          dependencies: { operation_Id: "dialog_errordetail:operation_Id", queryTimespan: "dialog_errordetail:queryspan" },
          params: {
            query: ({ operation_Id }) => ` 
              exceptions |
              where operation_Id == '${operation_Id}' |
              project handledAt, type, innermostMessage, operation_Id, timestamp, details 
            `
          }
        }
      ],
      elements: [
        {
          id: "errordetail-item",
          type: "Detail",
          title: "Error detail",
          size: { w: 12, h: 16 },
          dependencies: { values: "errordetail-data" },
          props: {
            cols: [
              { header: "Handle", field: "handledAt" },
              { header: "Type", field: "type" },
              { header: "Message", field: "innermostMessage" },
              { header: "Operation ID", field: "operation_Id" },
              { header: "Timestamp", field: "timestamp" },
              { header: "Details", field: "details" }
            ]
          }
        }
      ]
    }
  ]
}