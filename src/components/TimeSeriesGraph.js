import Fluxxor from 'fluxxor';
import React from 'react';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/pie';
import 'amcharts3-export';
import 'amcharts3-export/export.css';
import 'amcharts3/amcharts/themes/dark';

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

 refreshChart: function(graphDataset){
    let graphDefaults = {
        "valueAxis": "v1",
        "balloonText": "<b>[[title]]</b><br><span style='font-size:8px;'>[[value]] mentions</span>",
        "lineThickness": 2,
        "hideBulletsCount": 30
    };

    const {colorMap} = this.getStateFromFlux();
    let self = this;
    this.trendingTimeSeries.graphs = [];
    this.trendingTimeSeries.dataProvider = [];

    if(graphDataset && graphDataset.labels && graphDataset.graphData && colorMap){
        this.trendingTimeSeries.dataProvider = graphDataset.graphData;
        if(graphDataset.labels){
            graphDataset.labels.filter(label=>label.length > 1)
                               .forEach(label => {
                                            self.trendingTimeSeries.graphs.push(Object.assign({ id: `v${label}`, 
                                                    lineColor: colorMap.get(label)}, 
                                                    {valueField: label}, 
                                                    {title: label}, graphDefaults));
            });
        }
    }

    this.trendingTimeSeries.validateData();
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
    const hasTimeSpanChanged = this.hasChanged(nextProps, "timespan");
    const {timeSeriesGraphData} = this.getStateFromFlux();

    if(!this.trendingTimeSeries){
        this.initializeGraph();
        this.refreshChart(timeSeriesGraphData);
    }else if((this.hasChanged(nextProps, "mainEdge") && nextProps.edgeType === "Term") || hasTimeSpanChanged || this.hasChanged(nextProps, "dataSource")){
        this.refreshChart(timeSeriesGraphData);
    }
 },
  
 render: function() {
    return (
        <div>
        </div>
     );
   }
 });