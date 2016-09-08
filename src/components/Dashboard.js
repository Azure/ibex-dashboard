import React, { PropTypes, Component } from 'react';
import Fluxxor from 'fluxxor';
import {DataSelector} from './DataSelector';
import {TrendsPanel} from './TrendsPanel';
import {HeatMap} from './HeatMap';
import {SentimentTreeview} from './SentimentTreeview';
import {TimeSeriesGraph} from './TimeSeriesGraph';
import {SentimentSummaryChart} from './SentimentSummaryChart';
import {PopularTermsPie} from './PopularTermsPie';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const Dashboard = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState: function() {
      this.getFlux().actions.DASHBOARD.initialize();
  },

  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },

  componentWillReceiveProps: function(nextProps) {
       this.setState(this.getStateFromFlux());
  },
  
   render() {
    return (
        <div>
          <form>
            <div className="app-container">
              <div className="container-fluid">
                <DataSelector />
                <div className="row graphContainer">
                    <div className="col-lg-2 summaryPieContainer">
                       <div id="popularTermsPieDiv" style={{width: '100%', height: '300px'}}></div>
                       <PopularTermsPie />
                    </div>
                    <div className="col-lg-10 timeSeriesContainer">
                       <div id="graphdiv" style={{width: '100%', height: '300px', marginBottom: '0px', paddingBottom: '0px'}}></div>
                       <TimeSeriesGraph />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2 termBrowserContainer">
                        <SentimentTreeview />
                    </div>
                    <div className="col-lg-10 heatmapContainer">
                      <div className="row" className="tagFilterRow">
                         
                      </div>
                      <div className="row">
                          <div id='leafletMap'></div>
                          <HeatMap />
                      </div>
                    </div>
                </div>
            </div>
          </div>
          </form>
        </div>
      );
    }
  });
