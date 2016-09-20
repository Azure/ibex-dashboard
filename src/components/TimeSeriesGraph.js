import Fluxxor from 'fluxxor';
import React from 'react';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      graphDivId = "graphdiv";

export const TimeSeriesGraph = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState: function() {
    this.getFlux().actions.GRAPHING.load_timeseries_data(this.props.siteKey);
  },

  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  initializeGraph(){
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
            "equalSpacing": true,
            "axisColor": "#DADADA",
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true
        }
    });
  },

  refreshTrendingGraph(graphDataset, termColorMap){
    let graphDefaults = {
        "valueAxis": "v1",
        "balloonText": "<b>[[title]]</b><br><span style='font-size:8px;'>[[value]] mentions</span>",
        "lineThickness": 2,
        "hideBulletsCount": 30
    };

    let graphList = [];

    for(let i = 1; i < graphDataset.labels.length; i++){
        let label = graphDataset.labels[i];
        graphList.push(Object.assign({id: "v{0}".format(label === this.state.timeSeriesGraphData.mostPopularTerm ? "Max" : i), lineColor: termColorMap.get(label)}, {valueField: label}, {title: label}, graphDefaults));
    }
    
    this.trendingTimeSeries.graphs = graphList;
    this.trendingTimeSeries.dataProvider = graphDataset.aggregatedCounts;
    this.trendingTimeSeries.datetimeSelection = this.state.datetimeSelection;
    this.trendingTimeSeries.validateData();
  },
  
  updateTimeSeriesData(graphDataset, termColorMap){
    if(!this.trendingTimeSeries){
        this.initializeGraph();
    }

    let graphDateScope = this.trendingTimeSeries.datetimeSelection || '';

    if(graphDateScope !== this.state.datetimeSelection){
        this.refreshTrendingGraph(graphDataset, termColorMap);
    }
  },
  
  render() {
    if(this.state.timeSeriesGraphData && this.state.timeSeriesGraphData.aggregatedCounts && this.state.timeSeriesGraphData.aggregatedCounts.length > 0){
        this.updateTimeSeriesData(this.state.timeSeriesGraphData, this.state.timeSeriesGraphData.termColorMap);
    }

    return (
        <div>
        </div>
     );
   }
 });