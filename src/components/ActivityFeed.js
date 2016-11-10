import Fluxxor from 'fluxxor';
import React from 'react';
import {SERVICES} from '../services/services';
import '../styles/ActivityFeed.css';
import moment from 'moment';
import Infinite from 'react-infinite';
import CircularProgress from 'material-ui/lib/circular-progress';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const OFFSET_INCREMENT = 30;
const DEFAULT_LANGUAGE = "en";
const CONTAINER_HEIGHT = 510;
const INFINITE_LOAD_DELAY_MS = 2000; 
const MOMENT_FORMAT = "MM/DD HH:MM";

const styles ={
    sourceLogo: {
        color: "#337ab7"
    },
    listItemHeader: {
        fontSize: '11px',
        marginBottom: '3px',
        fontWeight: 800,
        textAlign: 'left'
    }
};

const ListItem = React.createClass({
    getDefaultProps: function() {
        return {
            height: 50
        }
    },
    render: function() {
        return <div className="infinite-list-item" style={
                        {
                            height: this.props.height,
                            lineHeight: this.props.lineHeight,
                            overflowY: 'scroll'
                        }
                    }>
            <h6 style={styles.listItemHeader}>
                {this.props.source === "twitter" ? <i style={styles.sourceLogo} className="fa fa-twitter"></i> : <i style={styles.sourceLogo} className="fa fa-facebook-official"></i>}
                {this.props.postedTime}
            </h6>
            <div>
                {this.props.sentence}
            </div>
        </div>;
    }
});
      
export const ActivityFeed = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
   
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },

  getInitialState: function() {
        return {
            elements: [],
            offset: 0,
            isInfiniteLoading: false
        }
  },

  handleInfiniteLoad: function() {
        var self = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(() => {
            self.processNewsFeed(self.state.elements, self.state.offset, self.props.bbox, 
                                    self.props.edges, self.props.datetimeSelection, self.props.timespanType);
        }, INFINITE_LOAD_DELAY_MS);
  },

  fetchSentences: function(offset, limit, bbox, edges, datetimeSelection, timespanType, callback){
      let siteKey = this.props.siteKey;
      let period = this.props.datetimeSelection;
      
      SERVICES.FetchMessageSentences(siteKey, bbox, period, timespanType, 
                                     limit, offset, edges, DEFAULT_LANGUAGE, undefined, callback);
  },

  hasChanged: function(nextProps, propertyName){
      if(this.props[propertyName] && nextProps[propertyName] && nextProps[propertyName] !== this.props[propertyName]){
          return true;
      }

      return false;
  },

  componentWillReceiveProps: function(nextProps){
      if(this.hasChanged(nextProps, "bbox") || this.hasChanged(nextProps, "datetimeSelection") ||  this.hasChanged(nextProps, "timespanType") || this.hasChanged(nextProps, "edges")){
          this.processNewsFeed([], 0, nextProps.bbox, nextProps.edges, nextProps.datetimeSelection, nextProps.timespanType);
      }
  },

  componentDidMount: function(){
      this.processNewsFeed([], 0, this.props.bbox, this.props.edges, this.props.datetimeSelection, this.props.timespanType);
  },

  buildElements: function(start, limit, elementStartList, bbox, edges, datetimeSelection, timespanType) {
        let elements = [];
        let self = this;
        let nextOffset = start + OFFSET_INCREMENT;

        this.fetchSentences(start, limit, bbox, edges, datetimeSelection, timespanType, 
            (error, response, body) => {
                if(!error && response.statusCode === 200 && body.data &&  body.data.byLocation) {
                    let featureCollection = body.data.byLocation.features;
                    if(featureCollection && Array.isArray(featureCollection)){
                        featureCollection.forEach(feature => {
                            elements.push(<ListItem id={feature.properties.messageid}
                                                    sentence={feature.properties.sentence}
                                                    source={feature.properties.source}
                                                    postedTime={moment(feature.properties.createdtime).format(MOMENT_FORMAT)} />)
                        });

                        self.setState({
                            offset: nextOffset,
                            isInfiniteLoading: false,
                            elements: elementStartList.concat(elements)
                        });
                    }
                }else{
                    console.error(`[${error}] occured while processing message request`);
                }
        });
  },

  processNewsFeed: function(elementStartList, offset, bbox, edges, datetimeSelection, timespanType){
      var self = this;

      if(bbox && edges && datetimeSelection && timespanType){
          self.buildElements(offset, OFFSET_INCREMENT, elementStartList, bbox, edges, datetimeSelection, timespanType);
      }
  },
  
  elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading... <CircularProgress />
        </div>;
  },
  
  render() {

    return (
     <div className="col-lg-12 news-feed-column">
            <ul className="nav nav-tabs feed-source-header">
                <li role="presentation" className="feed-source-label active"><a href="#" aria-controls="home"><i className="fa fa-share-alt"></i>&nbsp;All&nbsp;</a></li>
                <li role="presentation" className="feed-source-label"><a href="#" aria-controls="profile"><i className="fa fa-facebook-official"></i>&nbsp;Facebook&nbsp;</a></li>
                <li role="presentation" className="feed-source-label"><a href="#" aria-controls="messages"><i className="fa fa-twitter"></i>&nbsp;Twitter&nbsp;</a></li>
            </ul>
            <Infinite elementHeight={51}
                      containerHeight={CONTAINER_HEIGHT}
                      infiniteLoadBeginEdgeOffset={300}
                      className="infite-scroll-container"
                      onInfiniteLoad={this.handleInfiniteLoad}
                      loadingSpinnerDelegate={this.elementInfiniteLoad()}
                      isInfiniteLoading={this.state.isInfiniteLoading}
                      timeScrollStateLastsForAfterUserScrolls={1000} >
                    {this.state.elements}
            </Infinite>
            <div className="panel-footer clearfix">
                  <div className="input-group">
                       <input type="text" placeholder="Filter Activity .." className="form-control input-sm" />
                       <span className="input-group-btn">
                             <button type="submit" className="btn btn-default btn-sm"><i className="fa fa-search"></i>
                             </button>
                       </span>
                  </div>
            </div>
      </div>
     );
  }
});