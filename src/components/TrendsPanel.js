import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import {SentimentBarChart} from './SentimentBarChart';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const rowStyle = {
  paddingTop: '2px',
  paddingBottom: '2px'
};

export const TrendsPanel = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.getFlux().actions.TRENDS.load_trends();
  },
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  lookupEventSourceIcon(source){
     let icon = Actions.constants.EVENT_SOURCE_ICON_MAP[source];
     
     return icon ? icon : 'N/A';
  },
  
  render() {
    let self = this;
    
    return (
     <div className="col-lg-3 trend-column">
       <div className="row">
          <List subheader="What's Trending" className="panel panel-default">
                <div className="list-group list-group-trends" data-scrollable="">
                  {
                        this.state.trends.map((trend, index) => {
                            return <div>
                                    <ListItem primaryText={
                                                <div className="media-body media-body-trends">
                                                    <strong>{trend.trendingType}</strong> -- <a href="#">{trend.trendingValue}</a> on <i className={self.lookupEventSourceIcon(trend.source)}></i>
                                                    <div className="pull-right news-feed-content-date">Trending {trend.trendingTimespan}</div>
                                                </div>
                                            } 
                                            secondaryText={
                                                <p className="media-body">
                                                   {trend.trendingVolume && trend.trendingVolume > 0 ? <span>{trend.trendingVolume}k {trend.source === 'twitter' ? "tweets" : "activities"}</span> : undefined}
                                                </p>
                                            }
                                            secondaryTextLines={2}
                                            innerDivStyle={rowStyle} />
                                <Divider inset={true} />
                                </div>
                        })
                  }
                </div>
          </List>
        </div>
        <div className="row">
            <canvas id="BarChart" style={{width: '100%', height: '250px'}}></canvas>
            <SentimentBarChart />
        </div>
      </div>
     );
  }
});