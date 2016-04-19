import global from '../utils/global';
import {SERVICES} from '../services/services';

const constants = {
           SENTIMENT_JSON_MAPPING : {
                "0": -5,
                "-1": -15,
                "1": 5
           },
           TIMESPAN_TYPES : {
                'hours': {
                    format: "MM/DD/YYYY HH:00", blobFormat: "[hour]-YYYY-MM-DDHH:00"
                },
                'days': {
                    format: "MM/DD/YYYY", blobFormat: "[day]-YYYY-MM-DD"
                },
                'months': {
                    format: "YYYY-MM", blobFormat: "[month]-YYYY-MM"
                },
                'customDate': {
                    format: "MM/DD/YYYY", reactWidgetFormat: "MMM Do YYYY", blobFormat: "[day]-YYYY-MM-DD"
                },
                'customDateTime': {
                    format: "MM/DD/YY HH:00", reactWidgetFormat: "MMM Do YYYY HH:00", blobFormat: "[hour]-YYYY-MM-DDHH:00"
                },
                'customMonth': {
                    format: "MMMM YYYY", reactWidgetFormat: "MMMM YYYY", blobFormat: "[month]-YYYY-MM"
                }
           },
           SENTIMENT_COLOR_MAPPING : {
               "negative": "#800026",
               "positive": "#FED976",
               "neutral": "#FD8D3C"
           },
           EVENT_SOURCE_ICON_MAP : {
               "twitter": "fa fa-twitter",
               "facebook": "fa fa-facebook-official"
           },
           HEATMAP : {
               RETRIEVE_HEATMAP_TILE: "HEATMAP"
           },
           ACTIVITY : {
               LOAD_EVENTS: "LOAD:ACTIVITIES",
               LOAD_SENTIMENT_TREE: "LOAD:TREE-VIEW"
           },
           TRENDS : {
               LOAD_TRENDS: "LOAD:TRENDS"
           },
           GRAPHING : {
               LOAD_GRAPH: "LOAD:GRAPH",
               LOAD_SENTIMENT_BAR_CHART: "LOAD:CHART",
               CHANGE_TIME_SCALE: "EDIT:TIME_SCALE"
           },
           DASHBOARD : {
               LOAD: "LOAD:DASHBOARD",
               CHANGE_SEARCH: "SEARCH:CHANGE",
               CHANGE_DATE: "DATE:CHANGE"
           }
};

const methods = {
    ACTIVITY: {
        load_activity_events: function(){
            let self = this;
            
            let dataStore = this.flux.stores.DataStore.dataStore;
            let currentKeyword = dataStore.categoryValue;
            
            SERVICES.getActivityEvents(currentKeyword, dataStore.categoryType, dataStore.datetimeSelection, dataStore.timespanType)
            .subscribe(response => {
                if(response && response.length > 0){
                    self.dispatch(constants.ACTIVITY.LOAD_EVENTS, {
                                            response: response
                    });
                }
            });
        },
        load_sentiment_tree_view: function(){
            let self = this;
            
            let dataStore = this.flux.stores.DataStore.dataStore;
            
            SERVICES.getSentimentTreeData(dataStore.categoryType, dataStore.categoryValue, dataStore.timespanType, dataStore.datetimeSelection)
            .subscribe(response => {
                if(response && response.length > 0){
                    self.dispatch(constants.ACTIVITY.LOAD_SENTIMENT_TREE, {
                                            response: response
                    });
                }
            });
        }
    },
    TRENDS : {
        load_trends: function(){
            let self = this;
            
            SERVICES.getTrendingKeywords()
            .subscribe(response => {
                if(response && response.length > 0){
                    self.dispatch(constants.TRENDS.LOAD_TRENDS, {
                                            response: response
                    });
                }
            });
        }
    },
    DASHBOARD: {
        initialize(){
          let self = this;

          SERVICES.getDefaultSuggestionList()
            .subscribe(response => {
                if(response && response.length > 0){
                    self.dispatch(constants.DASHBOARD.LOAD, {
                                            response: response
                    });
                }
            });
        },
        changeSearchFilter(newFilter, searchType){
           this.dispatch(constants.DASHBOARD.CHANGE_SEARCH, {filter: newFilter, type: searchType});
        },
        changeDate(datetimeString, timespanType){
           this.dispatch(constants.DASHBOARD.CHANGE_DATE, {newDateStr: datetimeString, dateType: timespanType});
        }
    },
    GRAPHING : {
        edit_time_scale(fromDate, toDate){
            this.dispatch(constants.GRAPHING.CHANGE_TIME_SCALE, {fromDate: fromDate, 
                                                                 toDate: toDate});
        },
        load_graph: function(){
            let self = this;
            
            SERVICES.getInitialGraphDataSet()
            .subscribe(response => {
                if(response && response.length > 0){
                    self.dispatch(constants.GRAPHING.LOAD_GRAPH, {
                                            response: response
                    });
                }
            });
        },
        load_sentiment_bar_chart: function(){
            let self = this;
            let dataStore = this.flux.stores.DataStore.dataStore;
            
            SERVICES.getSentimentDisperityDataSet(dataStore.timespanType, dataStore.dateSelection, dataStore.categoryType)
            .subscribe(response => {
                if(response && response.length > 0){
                    self.dispatch(constants.GRAPHING.LOAD_SENTIMENT_BAR_CHART, {
                                            response: response
                    });
                }
            });
        }
    }
};

export const Actions = {
  constants: constants,
  methods: methods
};
