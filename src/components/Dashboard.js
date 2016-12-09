import React from 'react';
import Fluxxor from 'fluxxor';
import {DataSelector} from './DataSelector';
import {HeatMap} from './HeatMap';
import {SentimentTreeview} from './SentimentTreeview';
import {ActivityFeed} from './ActivityFeed';
import {TimeSeriesGraph} from './TimeSeriesGraph';
import {PopularTermsChart} from './PopularTermsChart';
import {PopularLocationsChart} from './PopularLocationsChart';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import '../styles/Dashboard.css';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const Dashboard = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState: function() {
      return {
          openModal: false
      };
  },

  handleOpen(){
    this.setState({openModal: true});
  },

  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },

  componentWillReceiveProps: function(nextProps) {
       this.setState(this.getStateFromFlux());
  },

  handleClose(){
    this.setState({openModal: false});
  },
  
  FilterEnabledTerms(){
      let filteredTerms = [];

      for (var [term, value] of this.state.associatedKeywords.entries()) {
          if(value.enabled){
              filteredTerms.push(term);
          }
      }

      return filteredTerms;
  },

  selectedTerms(){
      let filteredTerms = [];

      for (var [term, value] of this.state.associatedKeywords.entries()) {
            if(value.enabled){
                filteredTerms.push(term);
            }
      }
      
      return filteredTerms;
  },
  
  render() {
    let modalClassName = "modalContent";
    const modalActions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
        <div>
          <form>
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
                                          mainEdge={this.state.categoryValue["name_"+this.props.language]}
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
                                                mainEdge={this.state.categoryValue["name_"+this.props.language]}
                                                edgeType={this.state.categoryType}
                                                timespanType={this.state.timespanType}
                                                storageConnection={this.state.settings.properties.storageConnectionString}
                                                dataSource={this.state.dataSource}
                                                timespan={this.state.datetimeSelection} />
                            : undefined
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 termBrowserContainer">
                        <SentimentTreeview {...this.props} 
                                           enabledTerms={this.FilterEnabledTerms()}
                                           language={this.state.language} />
                    </div>
                    <div className="col-md-6 heatmapContainer">
                      <div className="row">
                          <div id='leafletMap'></div>
                          <HeatMap {...this.props} />
                      </div>
                    </div>
                    <div className="col-md-3">
                        <div>
                            <i style={{color:"#fff", cursor: "pointer"}} className="fa fa-expand" onClick={this.handleOpen}></i>
                            <span className="news-feed-title">Expand News Feed</span>
                        </div>
                        <div className="row">
                            {this.state.bbox && this.state.bbox.length > 0 && this.state.categoryValue ? <ActivityFeed bbox={this.state.bbox} 
                                                          timespanType={this.state.timespanType}
                                                          datetimeSelection={this.state.datetimeSelection}
                                                          categoryValue={this.state.categoryValue}
                                                          dataSource={this.state.dataSource}
                                                          categoryType={this.state.categoryType}
                                                          language = {this.getStateFromFlux().language}
                                                          edges={this.selectedTerms()} 
                                                          {...this.props}  /> : undefined}
                         </div>
                    </div>
                </div>
                {
                    this.state.openModal ? 
                        <Dialog
                            actions={modalActions}
                            modal={false}
                            contentClassName={modalClassName}
                            open={this.state.openModal}
                            onRequestClose={this.handleClose} >
                                <ActivityFeed bbox={this.state.bbox} 
                                              dataSource={this.state.dataSource}
                                              timespanType={this.state.timespanType}
                                              datetimeSelection={this.state.datetimeSelection}
                                              categoryValue={this.state.categoryValue}
                                              categoryType={this.state.categoryType}
                                              edges={this.selectedTerms()} {...this.props} 
                                              language = {this.getStateFromFlux().language} />
                        </Dialog>
                      : undefined
                }
            </div>
          </div>
          </form>
        </div>
      );
    }
  });
