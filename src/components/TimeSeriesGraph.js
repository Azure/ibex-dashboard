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
            strokeWidth: 2,
            zoomCallback: this.timeRangeFiltered,
            dateWindow: [ Date.parse("2015/12/31 12:00:00"),
                          Date.parse("2016/02/18 12:00:00") ],
            colors: [
                '#015086',
                '#665385',
                '#6a8ea1',
                '#81a595',
                '#cab2d2'
            ]//,
            //showRangeSelector: true
        }
    );
  },
  
  timeRangeFiltered(minDate, maxDate, yRanges){
      let targetFormat = "MM/DD/YY HH"
      let newFromDate = moment(minDate).format(targetFormat);
      let newToDate = moment(maxDate).format(targetFormat);
      
      this.getFlux().actions.GRAPHING.edit_time_scale(newFromDate, newToDate);
  },
  
  componentDidMount(){
   let self = this;
   
   SERVICES.getInitialGraphDataSet()
                 .subscribe(response => {
                   if(response && response.graphData && response.graphData.length > 0){
                      self.initializeGraph(response); 
                   }
                 }, error => {
                     console.log('Something went terribly wrong with loading the initial graph dataset');
                 });
  },
  
  render() {
    return (
        <div className="col-lg-12">
        </div>
     );
   }
 });