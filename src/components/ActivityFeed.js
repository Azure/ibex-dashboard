import Fluxxor from 'fluxxor';
import React from 'react';
import {SERVICES} from '../services/services';
import {Actions} from '../actions/Actions';
import '../styles/ActivityFeed.css';
import moment from 'moment';
import Infinite from 'react-infinite';
import CircularProgress from 'material-ui/CircularProgress';
import Highlighter from 'react-highlight-words';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const OFFSET_INCREMENT = 18;
const DEFAULT_LANGUAGE = "en";
const ELEMENT_ITEM_HEIGHT = 85;
const TOP_SECTION_HEIGHT=358;
const INFINITE_LOAD_DELAY_MS = 2000;
const MOMENT_FORMAT = "MM/DD HH:MM:s";
const activeHeaderClass = "feed-source-label active", inactiveClass = "feed-source-label";
const styles ={
    sourceLogo: {
        color: "#337ab7"
    },
    listItemHeader: {
        fontSize: '11px',
        marginBottom: '3px',
        fontWeight: 800,
        textAlign: 'left',
        color: 'rgb(146, 168, 204)'
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
        fontSize: "12px"
    },
    highlight: {
        backgroundColor: '#ffd54f',
        fontWeight: '600'
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
            return "label label-primary label-news-feed";
        }else if(sentimentScore >= 30 && sentimentScore < 55){
            return "label label-neutral label-news-feed";
        }else if(sentimentScore >= 55 && sentimentScore < 80){
            return "label label-warning label-news-feed";
        }else{
            return "label label-danger label-news-feed";
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
        let commonTermsFromFilter = this.innerJoin(this.props.edges.concat([this.props.mainSearchTerm]), this.props.filters.concat([this.props.mainSearchTerm]));
        let searchWords = this.props.searchFilter ? this.props.edges.concat([this.props.searchFilter, this.props.mainSearchTerm]) : this.props.edges.concat([this.props.mainSearchTerm]);
        let dataSourceSchema = Actions.DataSourceLookup(this.props.source);

        return <div className="infinite-list-item" style={
                        {
                            height: this.props.height,
                            lineHeight: this.props.lineHeight,
                            overflowY: 'scroll',
                        }
                    }>
            <h6 style={styles.listItemHeader}>
                <i style={styles.sourceLogo} className={dataSourceSchema.icon}></i>
                {this.props.postedTime}
                {commonTermsFromFilter.map(item=><span key={item} style={styles.tagStyle} className={tagClassName}>{item}</span>)}
            </h6>
            <div>
                <Highlighter
                    searchWords={searchWords}
                    highlightStyle={styles.highlight}
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
            filteredSource: "all",
            isInfiniteLoading: false
        }
  },

  handleInfiniteLoad: function() {
        var self = this;
        
        //if the prevbiosuly loaded enumber of elements is less than the increment count
        //then we reached the end of the list. 
        if(this.state.previousElementLength < OFFSET_INCREMENT){
            this.setState({
                isInfiniteLoading: false
            });
        }else{
            this.setState({
                isInfiniteLoading: true
            });
            setTimeout(() => {
                const params = {...self.props, elementStartList: self.state.elements, offset: self.state.offset, filteredSource: this.state.filteredSource}; 
                self.processNewsFeed(params);
            }, INFINITE_LOAD_DELAY_MS);
        }
  },

  fetchSentences: function(requestPayload, callback){
      let {categoryValue, timespanType, searchValue, limit, offset, edges, siteKey, 
           categoryType, filteredSource, bbox, datetimeSelection} = requestPayload;
      let location = [];

      if(categoryType === "Location"){
          categoryValue = undefined;
          location = this.state.selectedLocationCoordinates;
      }
      
      SERVICES.FetchMessageSentences(siteKey, bbox, datetimeSelection, timespanType, 
                                     limit, offset, edges, DEFAULT_LANGUAGE, Actions.DataSources(filteredSource), 
                                     categoryValue, searchValue, location, callback);
  },

  renderDataSourceTabs: function(iconStyle){
    let tabs  = [], self = this;
    if(this.props.dataSource === "all"){
        for (let [source, value] of Actions.constants.DATA_SOURCES.entries()) {
                tabs.push(<li key={source} role="presentation" className={source === self.state.filteredSource ? activeHeaderClass : inactiveClass}><a onClick={self.sourceOnClickHandler.bind(self, source)}><i style={iconStyle} className={`${value.icon} fa-2x`}></i>{value.label}</a></li>)
        }
    }else{
        let tabSchema = Actions.constants.DATA_SOURCES.get(this.state.filteredSource); 
        tabs.push(<li key={this.state.filteredSource} role="presentation" className={activeHeaderClass}><a onClick={self.sourceOnClickHandler.bind(self, this.state.filteredSource)}><i style={iconStyle} className={`${tabSchema.icon} fa-2x`}></i>{tabSchema.label}</a></li>)
    }

    return tabs;
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
      if(this.hasChanged(nextProps, "bbox") || this.hasChanged(nextProps, "datetimeSelection") 
       ||  this.hasChanged(nextProps, "timespanType") || this.hasChanged(nextProps, "edges")
       ||  this.hasChanged(nextProps, "categoryValue") || this.hasChanged(nextProps, "dataSource")){

          const params = {...nextProps, elementStartList: [], offset: 0, filteredSource: nextProps.dataSource};

          this.setState({filteredSource: params.filteredSource});
          this.processNewsFeed(params);
      }
  },

  componentDidMount: function(){
      const params = {...this.props, elementStartList: [], offset: 0, filteredSource: this.props.dataSource};
      this.processNewsFeed(params);
  },

  buildElements: function(requestPayload) {
        let elements = [];
        let self = this;
        let nextOffset = requestPayload.start + OFFSET_INCREMENT;

        this.fetchSentences(requestPayload, 
            (error, response, body) => {
                if(!error && response.statusCode === 200 && body.data) {
                    let graphQLResponse = body.data[Object.keys(body.data)[0]];
                    if(graphQLResponse && graphQLResponse.features && Array.isArray(graphQLResponse.features)){
                        graphQLResponse.features.forEach(feature => {
                            if(feature.properties.sentence && feature.properties.sentence.length > 2){
                                elements.push(<FortisEvent key={feature.properties.messageid} 
                                                        id={feature.properties.messageid}
                                                        sentence={feature.properties.sentence}
                                                        source={feature.properties.source}
                                                        postedTime={moment(feature.properties.createdtime).format(MOMENT_FORMAT)}
                                                        sentiment={feature.properties.sentiment}
                                                        edges={feature.properties.edges}
                                                        filters={requestPayload.edges}
                                                        searchFilter={requestPayload.searchValue}
                                                        mainSearchTerm={this.props.categoryValue} />)                               
                            }
                        });

                        elements = requestPayload.elementStartList.concat(elements);
                    }
                }else{
                    console.error(`[${error}] occured while processing message request`);
                }
                
                self.setState({
                     offset: nextOffset,
                     isInfiniteLoading: false,
                     filteredSource: requestPayload.filteredSource,
                     previousElementLength: elements.length,
                     elements: elements
                });
        });
  },

  processNewsFeed: function(filteredSources){
      const params = {...filteredSources, limit: OFFSET_INCREMENT, start: filteredSources.offset};
      this.setState({
          isInfiniteLoading: true
      });
      
      if(params.bbox && params.edges && params.datetimeSelection && params.timespanType){
          this.buildElements(params);
      }
  },
  
  elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading... <CircularProgress />
        </div>;
  },

  sourceOnClickHandler: function(filteredSource){
      const params = {...this.props, elementStartList: [], offset: 0, filteredSource: filteredSource};

      this.processNewsFeed(params);
  },

  searchSubmit(){
      const params = {...this.props, limit: OFFSET_INCREMENT, searchValue: this.refs.filterTextInput.value, filteredSource: this.state.filteredSource,
                      elementStartList: [], offset: 0};

      this.processNewsFeed(params);
  },
  
  render() {
    let iconStyle = {
        color: "#337ab7"
    };

    return (
     <div className="col-lg-12 news-feed-column">
            <ul className="nav nav-tabs feed-source-header">
                { this.renderDataSourceTabs(iconStyle) }
            </ul>
            <Infinite elementHeight={ELEMENT_ITEM_HEIGHT}
                      containerHeight={window.innerHeight-TOP_SECTION_HEIGHT}
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