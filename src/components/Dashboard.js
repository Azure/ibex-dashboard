import React, { PropTypes, Component } from 'react';
import Fluxxor from 'fluxxor';
import {DataSelector} from './DataSelector';
import {TrendsPanel} from './TrendsPanel';
import {HeatMap} from './HeatMap';
import {SentimentTreeview} from './SentimentTreeview';
import {TimeSeriesGraph} from './TimeSeriesGraph';
import {SentimentBarChart} from './SentimentBarChart';

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
                <div className="row">
                    <TrendsPanel />
                    <div className="col-lg-6">
                        <div id='leafletMap'></div>
                        <HeatMap />
                    </div>
                    <SentimentTreeview />
                </div>
                <div className="row graphContainer">
                    <div className="col-lg-3">
                      <div className="aggregatedBarChartTitle">Aggregated Sentiment Breakdown</div>
                      <canvas id="BarChart" style={{width: '100%', height: '300px'}}></canvas>
                    </div>
                    <SentimentBarChart />                
                    <div className="col-lg-9">
                        <div id="graphdiv" style={{width: '100%'}}></div>
                         <TimeSeriesGraph />
                    </div>                
                </div>
            </div>
          </div>
          </form>
        </div>
      );
    }
  });
