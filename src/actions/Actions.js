import global from '../utils/global';
import {SERVICES} from '../services/services';

const constants = {
           SENTIMENT_JSON_MAPPING : {
                "positive": "a",
                "neutral": "n",
                "negative": "h"
           },
           TIMESPAN_TYPES : {
                'hour': {
                    newFormat: "YYYY-MM-DD HH:00"
                },
                'day': {
                    newFormat: "YYYY-MM-DD"
                },
                'month': {
                    newFormat: "YYYY-MM"
                },
                'year': {
                    newFormat: "YYYY"
                },
                'alltime': {}
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
               CHANGE_SEARCH: "SEARCH:CHANGE"
           }
};

const methods = {
    ACTIVITY: {
        load_activity_events: function(){
            let self = this;
            
            let dataStore = this.flux.stores.DataStore.dataStore;
            let currentKeyword = dataStore.categoryValue;
            
            SERVICES.getActivityEvents(currentKeyword, dataStore.categoryType, dataStore.fromDate, dataStore.toDate)
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
            
            SERVICES.getSentimentTreeData(dataStore.categoryType, dataStore.categoryValue, dataStore.fromDate, dataStore.toDate)
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
        }
    },
    GRAPHING : {
        edit_time_scale(newFromDate, newToDate){
            this.dispatch(constants.GRAPHING.CHANGE_TIME_SCALE, {from: newFromDate, 
                                                                 to: newToDate});
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
            
            SERVICES.getSentimentDisperityDataSet(dataStore.fromDate, dataStore.toDate, dataStore.categoryType)
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
