import {SERVICES} from '../services/services';

const ENGLISH_LANGUAGE = "en";

function GetSearchKeywords(siteKey, languageCode, callback){
    SERVICES.getDefaultSuggestionList(siteKey)
         .subscribe(tableValues => {
              if(tableValues.response && tableValues.response.value){
                    let processedResults = tableValues.response.value.map(kw => {
                              if(kw[`${languageCode}_term`]){
                                  return {"category": "keyword", "searchTerm": kw[`${languageCode}_term`].toLowerCase()};
                              }else{
                                  throw new Error(`${languageCode} is an unsupported language`);
                              }                              
                    });

                    callback(processedResults);
             }
     },
         error => {
              console.error('An error occured trying to query the search terms: ' + error);
     });
}

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
           MOMENT_FORMATS: {
               "timeScaleDate": "MM/DD/YY HH:00"
           },
           SENTIMENT_COLOR_MAPPING : {
               "negative": "red",
               "neutral": "yellow",
               "positive": "green"
           },
           EVENT_SOURCE_ICON_MAP : {
               "twitter": "fa fa-twitter",
               "facebook": "fa fa-facebook-official"
           },
           CATEGORY_KEY_MAPPING: {
             'kw': 'keyword',
             'g': 'group',
             'sec': 'sector',
             'st': 'status'
           },
           HEATMAP : {
               RETRIEVE_HEATMAP_TILE: "HEATMAP"
           },
           ACTIVITY : {
               LOAD_EVENTS: "LOAD:ACTIVITIES"
           },
           GRAPHING : {
               LOAD_GRAPH_DATA: "LOAD:GRAPH_DATA",
               CHANGE_TIME_SCALE: "EDIT:TIME_SCALE"
           },
           DASHBOARD : {
               LOAD: "LOAD:DASHBOARD",
               CHANGE_SEARCH: "SEARCH:CHANGE",
               CHANGE_DATE: "DATE:CHANGE",
               ASSOCIATED_TERMS: "UPDATE:ASSOCIATED_TERMS",
               CHANGE_TERM_FILTERS: "UPDATE:CHANGE_TERM_FILTERS"
           },
           FACTS : {
               LOAD_FACTS: "LOAD:FACTS",
               LOAD_FACTS_SUCCESS: "LOAD:FACTS_SUCCESS",
               LOAD_FACTS_FAIL: "LOAD:FACTS_FAIL",
               SAVE_PAGE_STATE: "SAVE:PAGE_STATE",
               LOAD_FACT: "LOAD:FACT"
           },
};

const methods = {
    ACTIVITY: {
        load_activity_events: function(siteKey){
            let self = this;
            
            let dataStore = this.flux.stores.DataStore.dataStore;
            let currentKeyword = dataStore.categoryValue;
            
            SERVICES.getActivityEvents(siteKey, currentKeyword, dataStore.categoryType, dataStore.datetimeSelection, dataStore.timespanType)
            .subscribe(response => {
                if(response && response.length > 0){
                    self.dispatch(constants.ACTIVITY.LOAD_EVENTS, {
                                            response: response
                    });
                }
            });
        }
    },
    DASHBOARD: {
        initialize(siteKey){
          let self = this;
          
          let azureStorageCB = results => {
                if(results && results.length > 0){
                    self.dispatch(constants.DASHBOARD.LOAD, {
                                            response: results,
                                            siteKey: siteKey
                    });
                }
          };

          GetSearchKeywords(siteKey, ENGLISH_LANGUAGE, azureStorageCB);
        },
        changeSearchFilter(newFilter, searchType){
           this.dispatch(constants.DASHBOARD.CHANGE_SEARCH, {newFilter, searchType});
        },
        changeTermsFilter(newFilters){
           this.dispatch(constants.DASHBOARD.CHANGE_TERM_FILTERS, newFilters);
        },
        updateAssociatedTerms(associatedKeywords){
            this.dispatch(constants.DASHBOARD.ASSOCIATED_TERMS, associatedKeywords);
        },
        changeDate(siteKey, datetimeSelection, timespanType){
           let self = this;

           SERVICES.getPopularTermsTimeSeries(siteKey, datetimeSelection, timespanType)
                      .subscribe(timeSeriesResponse => {
                             if(timeSeriesResponse && timeSeriesResponse.graphData && timeSeriesResponse.graphData.length > 0){
                                 self.dispatch(constants.DASHBOARD.CHANGE_DATE, {timeSeriesResponse, datetimeSelection, timespanType});
                             }
                      }, error => {
                        let emptyTimeSeries = {graphData: [], labels: []};
                        
                        //If we reached here then the datetime blob is not available. We should continue
                        //to dispatch the flux operation to the front-end so the search terms / date is reflected.
                        self.dispatch(constants.DASHBOARD.CHANGE_DATE, {timeSeriesResponse: emptyTimeSeries, datetimeSelection: datetimeSelection, timespanType: timespanType});
           });
        }
    },
    GRAPHING : {
        edit_time_scale(fromDate, toDate){
            this.dispatch(constants.GRAPHING.CHANGE_TIME_SCALE, {fromDate: fromDate, 
                                                                 toDate: toDate});
        },
        load_timeseries_data: function(siteKey){
            let self = this;
            let dataStore = this.flux.stores.DataStore.dataStore;

            if(dataStore.datetimeSelection && dataStore.timespanType){
                SERVICES.getPopularTermsTimeSeries(siteKey, dataStore.datetimeSelection, dataStore.timespanType)
                            .subscribe(response => {
                                if(response && response.graphData && response.graphData.length > 0){
                                    self.dispatch(constants.GRAPHING.LOAD_GRAPH_DATA, {response: response});
                                }
                            }, error => {
                                console.log('Something went terribly wrong with loading the initial graph dataset');
                            });
            }
        }
    },
    FACTS: {
        load_facts: function (pageSize, skip) {
            let self = this;
            let dataStore = this.flux.stores.FactsStore.dataStore;
            if (!dataStore.loading) {
                this.dispatch(constants.FACTS.LOAD_FACTS);
                SERVICES.getFacts(pageSize, skip)
                    .subscribe(response => {
                        self.dispatch(constants.FACTS.LOAD_FACTS_SUCCESS, { response: response });
                    }, error => {
                        console.warning('Error, could not load facts', error);
                        self.dispatch(constants.FACTS.LOAD_FACTS_FAIL, { error: error });
                    });
            }
        },
        save_page_state: function(pageState) {
            this.dispatch(constants.FACTS.SAVE_PAGE_STATE, pageState);
        },
        load_fact: function (id) {
            let self = this;
            let dataStore = this.flux.stores.FactsStore.dataStore;

            dataStore.factDetail = null;

            if (!dataStore.factDetail) {
                SERVICES.getFact(id)
                    .subscribe(response => {
                        self.dispatch(constants.FACTS.LOAD_FACT, { response: response });
                    }, error => {
                        console.warning('Error, could not load fact id: ' + id, error);
                    });
            }
        }
    }
};

export const Actions = {
  constants: constants,
  methods: methods
};
