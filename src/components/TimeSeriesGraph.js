import Fluxxor from 'fluxxor';
import React from 'react';
import {SERVICES} from '../services/services';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      graphDivId = "graphdiv";

export const TimeSeriesGraph = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  initializeGraph: function(){
    this.trendingTimeSeries = window.AmCharts.makeChart(graphDivId, {
        "type": "serial",
        "mouseWheelZoomEnabled":true,
        "theme": "dark",
        "dataProvider": [],
        "marginLeft":"0",
        "marginRight": 40,
        "autoMarginOffset": 20,
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
            "graph": "vMax",
            "scrollbarHeight": 40,
            "autoGridCount":true
        },
        "valueScrollbar":{
            "oppositeAxis":false,
            "scrollbarHeight":10
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
            "minPeriod": "hh",
            "equalSpacing": true,
            "axisColor": "#DADADA",
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true
        }
    });
 },

 sortLabels: function(termA, termB){
      if(termB[1] > termA[1]){ 
         return 1;
      }else if(termB[1] < termA[1]){
          return -1;
      }

      if(termA[0] > termB[0]){
          return 1;
      }else if(termA[0] < termB[1]){
          return -1;
      }

      return 0;
  },

 refreshChart: function(graphDataset){
    let graphDefaults = {
        "valueAxis": "v1",
        "balloonText": "<b>[[title]]</b><br><span style='font-size:8px;'>[[value]] mentions</span>",
        "lineThickness": 2,
        "hideBulletsCount": 30
    };

    let sliceColors = ['#fdd400', '#84b761', '#b6d2ff', '#CD0D74', '#2f4074', '#7e6596'];
    let self = this;
    let labelAggregatedMap = new Map();
    this.trendingTimeSeries.graphs = [];
    this.trendingTimeSeries.dataProvider = [];

    if(graphDataset && graphDataset.labels && graphDataset.graphData){
        //Start off by ensuring the timeslices are order by date. 
        let timeseriesDataset = {
            "labels": graphDataset.labels,
            "graphData": graphDataset.graphData.sort((a, b) => a[0]>b[0] ? 1 : a[0]<b[0] ? -1 : 0 )
        };

        //Aggregate the pos and neg count for each label, for each timeperiod
        this.trendingTimeSeries.dataProvider = timeseriesDataset.graphData.map(hourlyAggregate => {
            let graphEntry = {"date": new Date(hourlyAggregate[0])};
            let tsIndex = 2, labelIndex = 1;

            while(tsIndex < hourlyAggregate.length - 1){
                let label = timeseriesDataset.labels[labelIndex++];
                graphEntry[label] = hourlyAggregate[++tsIndex] + hourlyAggregate[++tsIndex];
                let totalTermMentions = (labelAggregatedMap.get(label) || 0) + graphEntry[label];
                labelAggregatedMap.set(label, totalTermMentions);
            }

            return graphEntry;
        });

        let sortedLabelMap = new Map([...labelAggregatedMap.entries()].sort(this.sortLabels));

        for (var [label] of sortedLabelMap.entries()) {
            self.trendingTimeSeries.graphs.push(Object.assign({ id: `v${label}`, 
                                                lineColor: sliceColors.pop()}, 
                                                {valueField: label}, 
                                                {title: label}, graphDefaults));
        }
    }

    this.trendingTimeSeries.validateData();
 },
  
 updateChart: function(mainEdge, timespan, timespanType){
     let self = this;
     let selectedTerm = mainEdge ? `kw-${mainEdge}` : "top5";

     SERVICES.getPopularTermsTimeSeries(this.props.siteKey, timespan, timespanType, selectedTerm, 
            (error, response, body) => {
                if(!error && response.statusCode === 200 && body) {
                    self.refreshChart(body);
                }else{
                    console.error(`[${error}] occured while processing popular terms graphql request`);
                    self.refreshChart({});
                }
     });
 },

 hasChanged: function(nextProps, propertyName){
      if(Array.isArray(nextProps[propertyName])){
          return nextProps[propertyName].join(",") !== this.props[propertyName].join(",");
      }

      if(this.props[propertyName] && nextProps[propertyName] && nextProps[propertyName] !== this.props[propertyName]){
          return true;
      }

      return false;
 },

 componentWillReceiveProps: function(nextProps){
    let hasTimeSpanChanged = this.hasChanged(nextProps, "timespan");

    if(!this.trendingTimeSeries){
        this.initializeGraph();     
        this.updateChart(nextProps.mainEdge, nextProps.timespan, nextProps.timespanType);
    }else if((this.hasChanged(nextProps, "mainEdge") && nextProps.edgeType === "Term") || hasTimeSpanChanged){
        this.updateChart(!hasTimeSpanChanged ? nextProps.mainEdge : undefined, nextProps.timespan, nextProps.timespanType);
    }
 },
  
 render: function() {
    return (
        <div>
        </div>
     );
   }
 });