import React from 'react';
import Fluxxor from 'fluxxor';
import {DataSelector} from './DataSelector';
import {HeatMap} from './HeatMap';
import {SentimentTreeview} from './SentimentTreeview';
import {TimeSeriesGraph} from './TimeSeriesGraph';
import {PopularTermsChart} from './PopularTermsChart';
import '../styles/Dashboard.css';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const Dashboard = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState: function() {
      let siteKey = this.props.siteKey;

      this.getFlux().actions.DASHBOARD.initialize(siteKey);
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
                <DataSelector {...this.props} />
                <div className="row graphContainer">
                    <div className="col-lg-3 summaryPieContainer">
                       <div id="popularTermsPieDiv" style={{width: '100%', height: '250px'}}></div>
                       <PopularTermsChart {...this.props}/>
                    </div>
                    <div className="col-lg-9 timeSeriesContainer">
                       <div id="graphdiv" style={{width: '100%', height: '250px', marginBottom: '0px', paddingBottom: '0px'}}></div>
                       <TimeSeriesGraph {...this.props}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2 termBrowserContainer">
                        <SentimentTreeview {...this.props} />
                    </div>
                    <div className="col-lg-10 heatmapContainer">
                      <div className="row">
                          <div id='leafletMap'></div>
                          <HeatMap {...this.props} />
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
