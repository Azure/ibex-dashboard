import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Dygraph from 'dygraphs';
import Rx from 'rx';
import moment from 'moment';
import {SERVICES} from '../services/services';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const TimeSeriesGraph = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState: function() {
    this.getFlux().actions.GRAPHING.load_timeseries_data();
  },
      
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  initializeGraph(graphDataset){
    this.graph = new Dygraph(
        document.getElementById('graphdiv'),
        graphDataset.graphData,
        {
            labels: graphDataset.labels,
            labelsSeparateLines: true,
            labelsDivWidth: 150,
            strokeWidth: 1,
            title: 'Event Pipeline Histogram',
            highlightCircleSize: 2,
            stackedGraph: true,
            highlightSeriesOpts: {
                strokeWidth: 3,
                strokeBorderWidth: 1,
                highlightCircleSize: 5
            },
            ylabel: 'Occurences',
            zoomCallback: this.timeRangeFiltered,
            colors: [
                '#015086',
                '#665385',
                '#6a8ea1',
                '#81a595',
                '#cab2d2'
            ]
        }
    );
  },
  
  timeRangeFiltered(minDate, maxDate, yRanges){      
      this.getFlux().actions.GRAPHING.edit_time_scale(minDate, maxDate);
  },
  
  fetchTimeSeriesData(){
        let self = this;
        let dygraphData = this.state.timeSeriesGraphData;
        
        if(dygraphData.aggregatedCounts && dygraphData.aggregatedCounts.length > 0){
               let formattedGrapData = dygraphData.aggregatedCounts.map(timeEntry =>{
                    //Unfortunate requirement that Dygraph expects native Javascript Dates for the mapping data.
                    timeEntry[0] = new Date(timeEntry[0]);
                                    
                    return timeEntry;
               });
                                
              self.initializeGraph({'labels': dygraphData.labels, 'graphData': formattedGrapData });
        }else if(this.graph && dygraphData.graphData.length == 0){
            this.graph.destroy();
        }
  },
  
  render() {
    if(this.state.timeSeriesGraphData && this.state.action != 'editingTimeScale'){
        this.fetchTimeSeriesData();
    }
    
    return (
        <div>
        </div>
     );
   }
 });