import Fluxxor from 'fluxxor';
import React from 'react';
import {SERVICES} from '../services/services';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/pie';
import 'amcharts3-export';
import 'amcharts3-export/export.css';
import 'amcharts3/amcharts/themes/dark';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      ParseAccountName = connectionString => {
          const matchingField = "AccountName=";
          const matchedPosition = connectionString.indexOf(matchingField);

          if(matchedPosition > -1){
              const endPosition = connectionString.indexOf(";", matchedPosition);

              return connectionString.substring(matchedPosition + matchingField.length, endPosition); 
          }else{
              return undefined;
          }
      },
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

    let self = this;
    this.trendingTimeSeries.graphs = [];
    this.trendingTimeSeries.dataProvider = [];

    if(graphDataset && graphDataset.labels && graphDataset.graphData && this.state.colorMap){
        //Start off by ensuring the timeslices are order by date. 
        let timeseriesDataset = {
            "labels": graphDataset.labels.map(label=>label.indexOf('-') > -1 ? label.split('-')[1] : label),
            "graphData": graphDataset.graphData.sort((a, b) => a[0]>b[0] ? 1 : a[0]<b[0] ? -1 : 0 )
        };

        //Aggregate the pos and neg count for each label, for each timeperiod
        this.trendingTimeSeries.dataProvider = timeseriesDataset.graphData.map(hourlyAggregate => {
            let graphEntry = {"date": new Date(hourlyAggregate[0])};
            let tsIndex = 2, labelIndex = 1;

            while(tsIndex < hourlyAggregate.length - 1){
                let label = timeseriesDataset.labels[labelIndex++];
                graphEntry[label] = hourlyAggregate[++tsIndex] + hourlyAggregate[++tsIndex];
            }

            return graphEntry;
        });

        //Set one bar for each label. Ensure the line color is consistent with the donut chart
        if(timeseriesDataset.labels){
            timeseriesDataset.labels.filter(label=>label.length > 1)
                                    .forEach(label => {
                                                self.trendingTimeSeries.graphs.push(Object.assign({ id: `v${label}`, 
                                                    lineColor: self.state.colorMap.get(label)}, 
                                                    {valueField: label}, 
                                                    {title: label}, graphDefaults));
            });
        }        
    }

    this.trendingTimeSeries.validateData();
 },
  
 updateChart: function(mainEdge, timespan, dataSource, timespanType){
     let self = this;
     let selectedTerm = mainEdge ? `kw-${mainEdge}` : "top5";
     
     if(this.state.settings.properties && this.state.settings.properties.storageConnectionString){
         const accountName = ParseAccountName(this.state.settings.properties.storageConnectionString);
         SERVICES.getPopularTermsTimeSeries(this.props.siteKey, accountName, timespan, timespanType, selectedTerm, dataSource, 
            (error, response, body) => {
                if(!error && response.statusCode === 200 && body) {
                    self.refreshChart(body);
                }else{
                    console.error(`[${error}] occured while processing popular terms graphql request`);
                    self.refreshChart({});
                }
         });
     }else{
         console.error("Required site settings are missing error.");
     }
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
        this.updateChart(nextProps.mainEdge, nextProps.timespan, nextProps.dataSource, nextProps.timespanType);
    }else if((this.hasChanged(nextProps, "mainEdge") && nextProps.edgeType === "Term") || hasTimeSpanChanged || this.hasChanged(nextProps, "dataSource")){
        this.updateChart(!hasTimeSpanChanged ? nextProps.mainEdge : undefined, nextProps.timespan, nextProps.dataSource, nextProps.timespanType);
    }
 },
  
 render: function() {
    return (
        <div>
        </div>
     );
   }
 });