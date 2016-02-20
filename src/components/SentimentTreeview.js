import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import {SERVICES} from '../services/services';
import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Checkbox from 'material-ui/lib/checkbox';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import {ActivityFeed} from './ActivityFeed';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const options = {
        
};

export const SentimentTreeview = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.getFlux().actions.ACTIVITY.load_sentiment_tree_view();
      this.getFlux().actions.ACTIVITY.load_activity_events();
      
      return {
          openModal: false,
          modalTitle: ''
      }
  },
  
  handleOpen(){
    this.setState({openModal: true});
  },

  handleClose(){
    this.setState({openModal: false});
  },
  
  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },
  
  recurseTree(dataTree){
      let rootItem = <ListItem primaryText="Sector Breakdown / Activity Feed Browser"
                               initiallyOpen = {true}
                               primaryTogglesNestedList={true}
                               nestedItems = {[]} />;
      let self = this;
      
      var recurseChildren = (data, parentListItem) => {
          if(!data){
              return;
          }
          
          data.map(node => {
              let modalTitle = "Activity Viewer for {0}".format(node.sentimentText);
              
              let treeItem = <ListItem 
                              primaryText={
                                  <div>
                                    <span>{node.sentimentText}&nbsp;</span>
                                    <span onClick={self.handleOpen} className="badge">{node.eventCount}</span>
                                  </div>
                              }
                              leftCheckbox={<Checkbox />}
                              nestedItems = {[]} />;
              
              parentListItem.props.nestedItems.push(treeItem);
              
              if(node.nodes){
                  recurseChildren(node.nodes, treeItem);
              }
          });
      };
      
      recurseChildren(dataTree, rootItem);
      
      return rootItem;
  },
  
  render(){
     let treeData = [];
     let contentClassName = "modalContent";
     
     if(this.state && this.state.sentimentTreeViewData){
         treeData = this.recurseTree(this.state.sentimentTreeViewData, );
     }
     
     const modalActions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];
     
     return (
        <div className="col-lg-3 news-feed-column">
         <List subheader="" className="panel panel-default">
          <div className="list-group" data-scrollable="">
            {
                this.state && this.state.sentimentTreeViewData ?                   
                    treeData : undefined
            }
          </div>
         </List>
         <Dialog
          actions={modalActions}
          modal={false}
          contentClassName={contentClassName}
          open={this.state.openModal}
          onRequestClose={this.handleClose} >
                <ActivityFeed />
        </Dialog>
        </div>
     );
  }
});
  