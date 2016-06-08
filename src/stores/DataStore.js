import Fluxxor from 'fluxxor';
import moment from 'moment';
import React, { PropTypes, Component } from 'react';
import {Actions as Actions} from '../actions/Actions';
import env_properties from '../../config.json';
import bs from 'binarysearch';

export const DataStore = Fluxxor.createStore({
    initialize(profile) {
      
      this.dataStore = {
          userProfile: profile,
          timespanType: 'customMonth',
          datetimeSelection: 'March 2016',//moment().format(Actions.constants.TIMESPAN_TYPES.days.format),
          categoryType: '',
          activities: [],
          action: '',
          trends: [],
          timeSeriesGraphData: [],
          indexedTimeSeriesMap: new Map(),
          sentimentChartData: [],
          timeseriesFromDate: false,
          timeseriesToDate: false,
          sentimentTreeViewData: [],
          categoryValue: '',
          defaultResults: []
      }
      
      this.bindActions(
            Actions.constants.ACTIVITY.LOAD_EVENTS, this.handleLoadActivites,
            Actions.constants.TRENDS.LOAD_TRENDS, this.handleLoadTrendingActivity,
            Actions.constants.DASHBOARD.LOAD, this.handleLoadDefaultSearchResults,
            Actions.constants.DASHBOARD.CHANGE_SEARCH, this.handleChangeSearchTerm,
            Actions.constants.GRAPHING.CHANGE_TIME_SCALE, this.handleChangeTimeScale,
            Actions.constants.GRAPHING.LOAD_GRAPH_DATA, this.handleLoadGraphData,
            Actions.constants.ACTIVITY.LOAD_SENTIMENT_TREE, this.handleLoadSentimentTreeView,
            Actions.constants.DASHBOARD.CHANGE_DATE, this.handleChangeDate
      );
    },

    getState() {
        return this.dataStore;
    },
    
    handleLoadActivites(activities){
        this.dataStore.activities = activities.response;
        this.emit("change");
    },
    
    handleLoadGraphData(timeSeries){
        this.refreshGraphData(timeSeries.response);
        this.emit("change");
    },
    
    indexTimeSeriesResponse(timeSeries){
        let self = this;
        this.sortedTimeSeriesDates = [];
        this.dataStore.indexedTimeSeriesMap.clear();
        
        if(timeSeries && timeSeries.graphData){
            //hash the time series data by the epoch time as we'll use this to render 
            //the aggregates in the bar chart based on the selected graph zoom area. 
            timeSeries.graphData.map(timeEntry => {
                self.dataStore.indexedTimeSeriesMap.set(timeEntry[0], timeEntry);
                self.sortedTimeSeriesDates.push(timeEntry[0]);
            });
        }
    },
    
    //a log(N) algorithm to aggregate the occurences and magnitude of the time series data.
    aggregateTimeSeriesData(fromDatetime, toDatetime){
        this.dataStore.sentimentChartData = [];
        let self = this;
        
        //If there's no provided from and todate then this is the initial data load for the bar chart
        //default both to the upper and lower bounds of the sortedTimeSeriesDates.
        if(!fromDatetime && !toDatetime && this.sortedTimeSeriesDates.length > 0){
            fromDatetime = this.sortedTimeSeriesDates[0];
            toDatetime = this.sortedTimeSeriesDates[this.sortedTimeSeriesDates.length - 1];
        }
        
        //Make sure to and from date is provided and there are both labels and time series data.
        if(fromDatetime && toDatetime && this.sortedTimeSeriesDates.length > 0 && this.dataStore.timeSeriesGraphData.labels.length > 0){
            //default the initial dataset with all the labels we're rendering. This has a max length of 6 labels. 
            for(let i = 1; i < this.dataStore.timeSeriesGraphData.labels.length; i++){
                this.dataStore.sentimentChartData.push({label: this.dataStore.timeSeriesGraphData.labels[i], occurences: 0, mag_n: Math.random()})
            }
            
            //extract the indexed time slices based on the from and to date range.
            let timeSlices = bs.rangeValue(this.sortedTimeSeriesDates, Math.abs(fromDatetime), Math.abs(toDatetime));
            //enumerate through all the time slices.
            timeSlices.map(datetime => {
                //pull the time slice details which contain the occurences and normalized magnitude sentiment.
                let datetimeData = self.dataStore.indexedTimeSeriesMap.get(datetime);
                if(datetimeData){
                    //we'll need to aggregate the occurences for each label across the date range.
                    self.dataStore.sentimentChartData.map((labelEntry, index) => {
                        self.dataStore.sentimentChartData[index].occurences += datetimeData[index + 1];
                    });
                }
            });
        }
    },
    
    handleLoadTrendingActivity(trends){
        this.dataStore.trends = this.trendingDataReducer(trends.response, 'trending');
        if(this.dataStore.trends.length > 0){
            this.dataStore.categoryValue = this.dataStore.trends[0].trendingValue;
            this.dataStore.categoryType = this.dataStore.trends[0].trendingType;
        }
        
        this.emit("change");
    },

    trendingDataReducer(response, fileredKey){
        let componentStateData = [];

        if(response != undefined){
            Object.keys(response).forEach(windowKey => {
                let timeWindow = response[windowKey];

                if((timeWindow.hasOwnProperty('cutoff_time') || timeWindow.hasOwnProperty('previous_cutoff_time')) && timeWindow.hasOwnProperty(fileredKey)){
                    let timeWindowDisplay = moment(timeWindow.cutoff_time || timeWindow.hasOwnProperty('previous_cutoff_time')).fromNow();
                    
                    timeWindow[fileredKey].map(dataItem => {
                         componentStateData.push({
                               'trendingVolume': dataItem.count,
                               'source': dataItem.source,
                               'trendingTimespan': timeWindowDisplay,
                               'trendingType': dataItem.type.toLowerCase().substring(0, dataItem.type.length - 1),
                               'trendingValue': dataItem.term
                         });
                    });
                }
            })
        }

        return componentStateData;
    },
    
    handleLoadDefaultSearchResults(searchResults){
        this.dataStore.defaultResults = searchResults.response;
        this.emit("change");
    },
    
    handleChangeTimeScale(dateRange){
        if(!dateRange.fromDate || !dateRange.fromDate){
            console.error('handleChangeTimeScale was called without providing both a from/to datetime.');
            return;
        }
        
        this.dataStore.timeseriesFromDate = moment(dateRange.fromDate).format(Actions.constants.MOMENT_FORMATS.timeScaleDate);
        this.dataStore.timeseriesToDate = moment(dateRange.toDate).format(Actions.constants.MOMENT_FORMATS.timeScaleDate);
        this.aggregateTimeSeriesData(dateRange.fromDate, dateRange.toDate);
        this.dataStore.action = 'editingTimeScale';
        
        this.emit("change");
    },
    
    refreshGraphData(timeSeriesData){
        this.dataStore.timeSeriesGraphData = timeSeriesData;
        this.indexTimeSeriesResponse(timeSeriesData);
        this.aggregateTimeSeriesData(false, false);
        this.dataStore.timeseriesFromDate = false;
        this.dataStore.timeseriesToDate = false;
    },
    
    handleChangeDate(changedData){
        this.dataStore.datetimeSelection = changedData.datetimeSelection;
        this.dataStore.timespanType = changedData.timespanType;
        this.refreshGraphData(changedData.timeSeriesResponse);
        this.dataStore.action = 'changedSearchTerms';
        
        this.emit("change");
    },
    
    handleChangeSearchTerm(changedData){
        this.dataStore.categoryValue = changedData.newFilter;
        this.dataStore.categoryType = changedData.searchType;
        this.refreshGraphData(changedData.timeSeriesResponse);
        this.dataStore.action = 'changedSearchTerms';
        
        this.emit("change");
    },
    
    handleLoadSentimentTreeView(treeView){
        this.dataStore.sentimentTreeViewData = treeView.response;
        
        this.emit("change");
    }
});