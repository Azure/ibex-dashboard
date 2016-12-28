import React from 'react';
import Fluxxor from 'fluxxor';
import {DataSelector} from './DataSelector';
import {HeatMap} from './HeatMap';
import {SentimentTreeview} from './SentimentTreeview';
import {ActivityFeed} from './ActivityFeed';
import {TimeSeriesGraph} from './TimeSeriesGraph';
import {PopularTermsChart} from './PopularTermsChart';
import {PopularLocationsChart} from './PopularLocationsChart';
import '../styles/Dashboard.css';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const Dashboard = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  getInitialState() {
      return {
          contentRowHeight: 0
      };
  },

  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  componentWillReceiveProps(nextProps) {
       this.setState(this.getStateFromFlux());
  },

  componentDidMount(){
      const contentRowHeight = document.getElementById('contentRow').clientHeight;
      this.setState({contentRowHeight});
  },

  render() {
    return (
        <div>
            <div className="app-container">
              <div className="container-fluid">
                <DataSelector {...this.props} />
                <div className="row graphContainer">
                    <div className="col-lg-3 summaryPieContainer">
                       <div id="popularLocationsPieDiv" style={{width: '100%', height: '230px'}}></div>
                       <PopularLocationsChart {...this.props} 
                             datetimeSelection={this.state.datetimeSelection}
                             timespanType={this.state.timespanType}
                             language={this.state.language}
                             dataSource={this.state.dataSource} />
                    </div>
                    <div className="col-lg-2 summaryPieContainer">
                       <div id="popularTermsPieDiv" style={{width: '100%', height: '230px'}}></div>
                       <PopularTermsChart {...this.props} 
                                          mainEdge={this.state.categoryValue["name_"+this.state.language]}
                                          edgeType={this.state.categoryType}
                                          timespanType={this.state.timespanType}
                                          timespan={this.state.datetimeSelection}
                                          language={this.state.language}
                                          dataSource={this.state.dataSource} />
                    </div>
                    <div className="col-lg-7 timeSeriesContainer">
                       <div id="graphdiv" style={{width: '100%', height: '230px', marginBottom: '0px', paddingBottom: '0px'}}></div>
                        { this.state.settings.properties ? 
                            <TimeSeriesGraph {...this.props}
                                                mainEdge={this.state.categoryValue.name}
                                                edgeType={this.state.categoryType}
                                                timespanType={this.state.timespanType}
                                                storageConnection={this.state.settings.properties.storageConnectionString}
                                                dataSource={this.state.dataSource}
                                                timespan={this.state.datetimeSelection} />
                            : undefined
                        }
                    </div>
                </div>
                <div className="row" id="contentRow">
                  <div>
                            <div className="col-md-3 termBrowserContainer">
                                <SentimentTreeview {...this.props} 
                                                enabledTerms={Array.from(this.state.termFilters)}
                                                language={this.state.language} />
                            </div>
                            <div className="col-md-6 heatmapContainer">
                            <div className="row">
                                <div id='leafletMap'></div>
                                <HeatMap  bbox={this.state.bbox} 
                                            dataSource={this.state.dataSource}
                                            timespanType={this.state.timespanType}
                                            datetimeSelection={this.state.datetimeSelection}
                                            categoryValue={this.state.categoryValue}
                                            language={this.state.language}
                                            categoryType={this.state.categoryType}
                                            edges={Array.from(this.state.termFilters)} 
                                            {...this.props} />
                            </div>
                            </div>
                            <div className="col-md-3">
                                <div className="row">
                                    {this.state.bbox && this.state.bbox.length > 0 && this.state.categoryValue ? 
                                                    <ActivityFeed bbox={this.state.bbox}
                                                                infiniteScrollHeight={this.state.contentRowHeight}
                                                                timespanType={this.state.timespanType}
                                                                datetimeSelection={this.state.datetimeSelection}
                                                                categoryValue={this.state.categoryValue}
                                                                dataSource={this.state.dataSource}
                                                                categoryType={this.state.categoryType}
                                                                language={this.state.language}
                                                                edges={Array.from(this.state.termFilters)} 
                                                                {...this.props}  /> : undefined}
                                </div>
                            </div>
                        </div>
                </div>
            </div>
          </div>
        </div>
      );
    }
  });
