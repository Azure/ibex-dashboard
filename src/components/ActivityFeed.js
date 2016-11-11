import Fluxxor from 'fluxxor';
import React from 'react';
import {SERVICES} from '../services/services';
import '../styles/ActivityFeed.css';
import moment from 'moment';
import Infinite from 'react-infinite';
import CircularProgress from 'material-ui/lib/circular-progress';
import Highlighter from 'react-highlight-words';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const OFFSET_INCREMENT = 18;
const DEFAULT_LANGUAGE = "en";
const CONTAINER_HEIGHT = 515;
const ELEMENT_ITEM_HEIGHT = 85;
const INFINITE_LOAD_DELAY_MS = 2000;
const SOURCE_MAP = new Map([["all", []], ["facebook", ["facebook-messages", "facebook-comments"]], ["twitter", ["twitter"]]]);
const MOMENT_FORMAT = "MM/DD HH:MM:s";
const SENTIMENT_TAG_STYLE_MAP = new Map([[""]]);

const styles ={
    sourceLogo: {
        color: "#337ab7"
    },
    listItemHeader: {
        fontSize: '11px',
        marginBottom: '3px',
        fontWeight: 800,
        textAlign: 'left',
        color: 'rgb(146, 168, 204);'
    },
    highlightStyles: {
        positive: {
            backgroundColor: "#337ab7"
        },
        neutral: {
            backgroundColor: "#caaa00"
        },
        negative: {
            backgroundColor: "#f48342"
        },
        veryNegative: {
            backgroundColor: "#d9534f"
        }
    },
    tagStyle: {
        marginLeft: "4px",
        fontSize: "10px"
    }
};

const FortisEvent = React.createClass({
    getDefaultProps: function() {
        return {
            height: ELEMENT_ITEM_HEIGHT
        }
    },
    getSentimentStyle(sentimentScore){
        if(sentimentScore >= 0 && sentimentScore < 30){
            return styles.highlightStyles.positive;
        }else if(sentimentScore >= 30 && sentimentScore < 55){
            return styles.highlightStyles.neutral;
        }else if(sentimentScore >= 55 && sentimentScore < 80){
            return styles.highlightStyles.negative;
        }else{
            return styles.highlightStyles.veryNegative;
        }
    },
    getSentimentLabelStyle(sentimentScore){
        if(sentimentScore >= 0 && sentimentScore < 30){
            return "label label-primary";
        }else if(sentimentScore >= 30 && sentimentScore < 55){
            return "label label-neutral";
        }else if(sentimentScore >= 55 && sentimentScore < 80){
            return "label label-warning";
        }else{
            return "label label-danger";
        }
    },
    innerJoin(arr1, arr2){
        let out = new Set();
        
        arr1.forEach(item=>{
            if(arr2.indexOf(item) > -1){
                out.add(item);
            }
        });
        
        return Array.from(out);
    },
    render: function() {
        let tagClassName = this.getSentimentLabelStyle(this.props.sentiment * 100);
        let commonTermsFromFilter = this.innerJoin(this.props.edges, this.props.filters);
        let searchWords = this.props.searchFilter ? this.props.edges.concat([this.props.searchFilter]) : this.props.edges;

        return <div className="infinite-list-item" style={
                        {
                            height: this.props.height,
                            lineHeight: this.props.lineHeight,
                            overflowY: 'scroll',
                        }
                    }>
            <h6 style={styles.listItemHeader}>
                {this.props.source === "twitter" ? <i style={styles.sourceLogo} className="fa fa-twitter"></i> : <i style={styles.sourceLogo} className="fa fa-facebook-official"></i>}
                {this.props.postedTime}
                {commonTermsFromFilter.map(item=><span style={styles.tagStyle} className={tagClassName}>{item}</span>)}
            </h6>
            <div>
                <Highlighter
                    highlightStyle={this.getSentimentStyle(this.props.sentiment * 100)}
                    searchWords={searchWords}
                    textToHighlight={this.props.sentence} />
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
            previousElementLength: 0,
            offset: 0,
            filteredSources: [],
            isInfiniteLoading: false
        }
  },

  handleInfiniteLoad: function() {
        var self = this;
        
        //if the prevbiosuly loaded enumber of elements is less than the increment count
        //then we reached the end of the list. 
        if(this.state.previousElementLength > 0 && this.state.previousElementLength < OFFSET_INCREMENT){
            this.setState({
                isInfiniteLoading: false
            });
            return;
        }

        this.setState({
            isInfiniteLoading: true
        });
        setTimeout(() => {
            self.processNewsFeed(self.state.elements, self.state.offset, self.props.bbox, 
                                    self.props.edges, self.props.datetimeSelection, self.props.timespanType, this.state.filteredSources);
        }, INFINITE_LOAD_DELAY_MS);
  },

  fetchSentences: function(offset, limit, bbox, edges, datetimeSelection, timespanType, filteredSources, searchValue, callback){
      let siteKey = this.props.siteKey;
      let period = this.props.datetimeSelection;
      let mainTerm = this.state.categoryValue;
      
      SERVICES.FetchMessageSentences(siteKey, bbox, period, timespanType, 
                                     limit, offset, edges, DEFAULT_LANGUAGE, filteredSources, mainTerm, searchValue, callback);
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
      if(this.hasChanged(nextProps, "bbox") || this.hasChanged(nextProps, "datetimeSelection") ||  this.hasChanged(nextProps, "timespanType") || this.hasChanged(nextProps, "edges")){
          this.processNewsFeed([], 0, nextProps.bbox, nextProps.edges, nextProps.datetimeSelection, nextProps.timespanType, [], undefined);
      }
  },

  componentDidMount: function(){
      this.processNewsFeed([], 0, this.props.bbox, this.props.edges, this.props.datetimeSelection, this.props.timespanType, [], undefined);
  },

  buildElements: function(start, limit, elementStartList, bbox, edges, datetimeSelection, timespanType, filteredSources, searchValue) {
        let elements = [];
        let self = this;
        let nextOffset = start + OFFSET_INCREMENT;

        this.fetchSentences(start, limit, bbox, edges, datetimeSelection, timespanType, filteredSources, searchValue, 
            (error, response, body) => {
                if(!error && response.statusCode === 200 && body.data &&  body.data.byLocation) {
                    let featureCollection = body.data.byLocation.features;
                    if(featureCollection && Array.isArray(featureCollection)){
                        featureCollection.forEach(feature => {
                            elements.push(<FortisEvent id={feature.properties.messageid}
                                                       sentence={feature.properties.sentence}
                                                       source={feature.properties.source}
                                                       postedTime={moment(feature.properties.createdtime).format(MOMENT_FORMAT)}
                                                       sentiment={feature.properties.sentiment}
                                                       edges={feature.properties.edges}
                                                       filters = {edges}
                                                       searchFilter={searchValue} />)
                        });

                        self.setState({
                            offset: nextOffset,
                            isInfiniteLoading: false,
                            filteredSources: filteredSources,
                            previousElementLength: elements.length,
                            elements: elementStartList.concat(elements)
                        });
                    }
                }else{
                    self.setState({
                            offset: 0,
                            isInfiniteLoading: false,
                            filteredSources: filteredSources,
                            previousElementLength: 0,
                            elements: []
                    });
                    console.error(`[${error}] occured while processing message request`);
                }
        });
  },

  processNewsFeed: function(elementStartList, offset, bbox, edges, datetimeSelection, timespanType, filteredSources, searchValue){
      var self = this;
      this.setState({
          isInfiniteLoading: true
      });
      
      if(bbox && edges && datetimeSelection && timespanType){
          self.buildElements(offset, OFFSET_INCREMENT, elementStartList, bbox, edges, datetimeSelection, timespanType, 
                             filteredSources, searchValue);
      }
  },
  
  elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading... <CircularProgress />
        </div>;
  },

  sourceOnClickHandler: function(filteredSources){
      this.processNewsFeed([], 0, this.props.bbox, this.props.edges, 
                           this.props.datetimeSelection, this.props.timespanType, filteredSources, undefined);
  },

  searchSubmit(){
      let searchValue = this.refs.filterTextInput.value;

      this.processNewsFeed([], 0, this.props.bbox, this.props.edges, 
                           this.props.datetimeSelection, this.props.timespanType, this.state.filteredSources, searchValue);
  },
  
  render() {
    let sourceTypes = [
        {"icon": "fa fa-share-alt", "mapName": "all", "label": "All"},
        {"icon": "fa fa-facebook-official", "mapName": "facebook", "label": "Facebook"},
        {"icon": "fa fa-twitter", "mapName": "twitter", "label": "Twitter"}
    ];

    let activeHeaderClass = "feed-source-label active", inactoveClass = "feed-source-label";

    return (
     <div className="col-lg-12 news-feed-column">
            <ul className="nav nav-tabs feed-source-header">
                {
                    sourceTypes.map(item => <li role="presentation" className={SOURCE_MAP.get(item.mapName) && SOURCE_MAP.get(item.mapName).join(" ") === this.state.filteredSources.join(" ") ? activeHeaderClass : inactoveClass}><a onClick={this.sourceOnClickHandler.bind(this, SOURCE_MAP.get(item.mapName))}><i className={item.icon}></i>{item.label}</a></li>)
                }
            </ul>
            <Infinite elementHeight={ELEMENT_ITEM_HEIGHT}
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
                       <input ref="filterTextInput" type="text" placeholder="Filter News Feed .." className="form-control input-sm" />
                       <span className="input-group-btn">
                             <button  onClick={this.searchSubmit} className="btn btn-default btn-sm"><i className="fa fa-search"></i>
                             </button>
                       </span>
                  </div>
            </div>
      </div>
     );
  }
});