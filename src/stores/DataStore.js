import Fluxxor from 'fluxxor';
import moment from 'moment';
import React, { PropTypes, Component } from 'react';
import {Actions as Actions} from '../actions/Actions';
import env_properties from '../../config.json';

export const DataStore = Fluxxor.createStore({
    initialize(profile) {
      
      this.dataStore = {
          userProfile: profile,
          timespanType: 'hour',
          fromDate: '02/19/2015',
          toDate: "02/19/2016",
          categoryType: "Keyword",
          activities: [],
          trends: [],
          sentimentChartData: [],
          sentimentTreeViewData: [],
          categoryValue: 'refugee',
          sentimentValues: Object.keys(Actions.constants.SENTIMENT_JSON_MAPPING),
          defaultResults: []
      }
      
      this.bindActions(
            Actions.constants.ACTIVITY.LOAD_EVENTS, this.handleLoadActivites,
            Actions.constants.TRENDS.LOAD_TRENDS, this.handleLoadTrendingActivity,
            Actions.constants.GRAPHING.LOAD_SENTIMENT_BAR_CHART, this.handleLoadSentimentBarChart,
            Actions.constants.DASHBOARD.LOAD, this.handleLoadDefaultSearchResults,
            Actions.constants.DASHBOARD.CHANGE_SEARCH, this.handleChangeSearchTerm,
            Actions.constants.GRAPHING.CHANGE_TIME_SCALE, this.handleChangeChangeTimeScale,
            Actions.constants.ACTIVITY.LOAD_SENTIMENT_TREE, this.handleLoadSentimentTreeView
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
    
    handleChangeChangeTimeScale(selection){
        this.dataStore.fromDate = selection.from;
        this.dataStore.toDate = selection.to;
        
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