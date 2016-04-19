import Fluxxor from 'fluxxor';
import moment from 'moment';
import React, { PropTypes, Component } from 'react';
import {Actions as Actions} from '../actions/Actions';
import env_properties from '../../config.json';

export const DataStore = Fluxxor.createStore({
    initialize(profile) {
      
      this.dataStore = {
          userProfile: profile,
          timespanType: 'customMonth',
          datetimeSelection: 'March 2016',//moment().format(Actions.constants.TIMESPAN_TYPES.days.format),
          categoryType: 'keywords',
          activities: [],
          trends: [],
          sentimentChartData: [],
          sentimentTreeViewData: [],
          categoryValue: 'refugees',
          defaultResults: []
      }
      
      this.bindActions(
            Actions.constants.ACTIVITY.LOAD_EVENTS, this.handleLoadActivites,
            Actions.constants.TRENDS.LOAD_TRENDS, this.handleLoadTrendingActivity,
            Actions.constants.GRAPHING.LOAD_SENTIMENT_BAR_CHART, this.handleLoadSentimentBarChart,
            Actions.constants.DASHBOARD.LOAD, this.handleLoadDefaultSearchResults,
            Actions.constants.DASHBOARD.CHANGE_SEARCH, this.handleChangeSearchTerm,
            Actions.constants.GRAPHING.CHANGE_TIME_SCALE, this.handleChangeTimeScale,
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
    
    handleLoadTrendingActivity(trends){
        this.dataStore.trends = trends.response;
        this.emit("change");
    },
    
    handleLoadSentimentBarChart(chartData){
        this.dataStore.sentimentChartData = chartData.response;
        this.emit("change");
    },
    
    handleLoadDefaultSearchResults(searchResults){
        this.dataStore.defaultResults = searchResults.response;
        this.emit("change");
    },
    
    handleChangeTimeScale(selection){
        //this.dataStore.datetimeSelection = selection.datetimeSelection;
        
        this.emit("change");
    },
    
    handleChangeDate(selection){
        this.dataStore.datetimeSelection = selection.newDateStr;
        this.dataStore.timespanType = selection.dateType;
        
        this.emit("change");
    },
    
    handleChangeSearchTerm(selection){
        this.dataStore.categoryValue = selection.filter;
        this.dataStore.categoryType = selection.type;
        
        this.emit("change");
    },
    
    handleLoadSentimentTreeView(treeView){
        this.dataStore.sentimentTreeViewData = treeView.response;
        
        this.emit("change");
    }
});