import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Rx from 'rx';
import {SERVICES} from '../services/services';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      graphDivId = "graphdiv";

export const TimeSeriesGraph = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState: function() {
    this.getFlux().actions.GRAPHING.load_timeseries_data();
  },
      
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  initializeGraph(){
    this.trendingTimeSeries = AmCharts.makeChart(graphDivId, {
        "type": "serial",
        "theme": "dark",
        "legend": {
            "useGraphSettings": true
        },
        "dataProvider": [],
        "titles":[{"text":"5 Most Mentioned Terms"}],
        "marginLeft":"0",
        "marginRight":"0",
        "synchronizeGrid":true,
        "valueAxes": [{
            "id":"v1",
            "axisColor": "#FF6600",
            "axisThickness": 2,
            "axisAlpha": 1,
            "position": "left"
        }],
        "categoryField": "date",
        "chartScrollbar": {
            "gridAlpha":0,
            "color":"#888888",
            "scrollbarHeight":40,
            "backgroundAlpha":0,
            "selectedBackgroundAlpha":0.1,
            "selectedBackgroundColor":"#888888",
            "graphFillAlpha":0,
            "autoGridCount":true,
            "selectedGraphFillAlpha":0,
            "graphLineAlpha":0.2,
            "graphLineColor":"#c2c2c2",
            "selectedGraphLineColor":"#888888",
            "selectedGraphLineAlpha":1
        },
        "chartCursor": {
            "categoryBalloonDateFormat": "MMM D HH:00",
            "cursorAlpha": 0,
            "valueLineEnabled":true,
            "valueLineBalloonEnabled":true,
            "valueLineAlpha":0.5,
            "fullWidth":true
        },
        "categoryAxis": {
            "parseDates": true,
            "equalSpacing": true,
            "axisColor": "#DADADA",
            "minorGridEnabled": true
        }
    });
  },

  refreshTrendingGraph(graphDataset){
    let graphLabelList = [
                {
                    lineColor: "#FF6600",
                    bullet: "round"
                },
                {
                    lineColor: "#FCD202",
                    bullet: "square"
                },
                {
                    lineColor: "#B0DE09",
                    bullet: "triangleUp"
                },
                {
                    lineColor: "#015086",
                    bullet: "triangleDown"
                },
                {
                    bullet: "bubble"
                }
            ];

    let graphDefaults = {
        "valueAxis": "v1",
        "bulletBorderThickness": 1,
        "type": "smoothedLine",
        "balloonText": "<b>[[title]]</b><br><span style='font-size:8px;'>[[value]] mentions</span>",
        "lineThickness": 2,
        "hideBulletsCount": 30,
		"fillAlphas": 0
    };

    let graphList = [];

    for(let i = 1; i < graphDataset.labels.length; i++){
        let label = graphDataset.labels[i];
        graphList.push(Object.assign(graphLabelList[i - 1], {valueField: label}, {title: label}, graphDefaults));
    }

    this.trendingTimeSeries.graphs = graphList;
    this.trendingTimeSeries.dataProvider = graphDataset.aggregatedCounts;
    this.trendingTimeSeries.datetimeSelection = this.state.datetimeSelection;
    this.trendingTimeSeries.validateData();
  },
  
  updateTimeSeriesData(graphDataset){
    if(!this.trendingTimeSeries){
        this.initializeGraph();
    }

    let graphDateScope = this.trendingTimeSeries.datetimeSelection || '';

    if(graphDateScope != this.state.datetimeSelection){
        this.refreshTrendingGraph(graphDataset);
    }
  },
  
  render() {
    if(this.state.timeSeriesGraphData && this.state.timeSeriesGraphData.aggregatedCounts && this.state.timeSeriesGraphData.aggregatedCounts.length > 0){
        this.updateTimeSeriesData(this.state.timeSeriesGraphData);
    }

    return (
        <div>
        </div>
     );
   }
 });