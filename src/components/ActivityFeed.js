import Fluxxor from 'fluxxor';
import React from 'react';
import {Actions} from '../actions/Actions';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import '../styles/ActivityFeed.css';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const styles = {
    panel: {
        backgroundColor: '#fff'
    }
};
      
export const ActivityFeed = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
   
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
     <div className="col-lg-12 news-feed-column">
        <List subheader="What's Happening Now" className="panel" style={styles.panel}>
            <ul className="nav nav-tabs">
                <li role="presentation" className="active"><a href="#" aria-controls="home"><i className="fa fa-share-alt"></i>&nbsp;All&nbsp;<span className="badge">42</span></a></li>
                <li role="presentation"><a href="#" aria-controls="profile"><i className="fa fa-facebook-official"></i>&nbsp;Facebook&nbsp;<span className="badge">32</span></a></li>
                <li role="presentation"><a href="#" aria-controls="messages"><i className="fa fa-twitter"></i>&nbsp;Twitter&nbsp;<span className="badge">10</span></a></li>
            </ul>
            <div className="list-group activity-list-group" data-scrollable="">
                {
                        this.state.activities.map((activity, index) => {
                            return <div>
                                    <ListItem leftAvatar={<Avatar src={activity.avatar} />}
                                            primaryText={
                                                <div className="media-body">
                                                    <strong>{activity.name}</strong> -- published a {activity.dataType} on <i className={self.lookupEventSourceIcon(activity.source)}></i>
                                                    <div className="pull-right news-feed-content-date">{activity.timeLabel}</div>
                                                </div>
                                            } 
                                            secondaryText={
                                                <p className="media-body well">
                                                {activity.messageTitle ? <span className="news-feed-content-title">{activity.messageTitle}</span> : undefined}
                                                <span dangerouslySetInnerHTML={{__html: activity.sentence}}>                                              
                                                </span>
                                                </p>
                                            }
                                            secondaryTextLines={2} />
                                <Divider inset={true} />
                                </div>
                        })
                }
            </div>
            <div className="panel-footer clearfix">
                  <div className="input-group">
                       <input type="text" placeholder="Filter Activity .." className="form-control input-sm" />
                       <span className="input-group-btn">
                             <button type="submit" className="btn btn-default btn-sm"><i className="fa fa-search"></i>
                             </button>
                       </span>
                  </div>
            </div>
        </List>
      </div>
     );
  }
});