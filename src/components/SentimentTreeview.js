import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import {SERVICES} from '../services/services';
import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Checkbox from 'material-ui/lib/checkbox';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const styles = {
  subHeader: {
    fontColor:'#a3a3b3'
  }
};

export const SentimentTreeview = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.getFlux().actions.ACTIVITY.load_sentiment_tree_view();
      
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
      let rootItem = <ListItem initiallyOpen = {true}
                               primaryTogglesNestedList={true}
                               nestedItems = {[]} />;
      let self = this;
      
      var recurseChildren = (data, parentListItem) => {
          if(!data){
              return;
          }
          
          data.map(node => {              
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
     
     if(this.state && this.state.sentimentTreeViewData){
         treeData = this.recurseTree(this.state.sentimentTreeViewData, );
     }
     
     return (
        <div>
         <List subheader="" className="panel panel-default">
            <Subheader style={styles.subHeader}>Associated Terms Selector</Subheader>
            <div className="list-group" data-scrollable="">
                {
                    this.state && this.state.sentimentTreeViewData ?                   
                        treeData : undefined
                }
            </div>
         </List>
        </div>
     );
  }
});
  