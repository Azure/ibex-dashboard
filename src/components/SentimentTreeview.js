import {SERVICES} from '../services/services';
import Fluxxor from 'fluxxor';
import Subheader from './Subheader';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import {Treebeard, decorators} from 'react-treebeard';
import * as filters from './TreeFilter';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const styles = {
  subHeader: {
    color:'#a3a3b3',
    fontWeight: 800
  },
  component: {
     display: 'block',
     verticalAlign: 'top',
     overflowX: 'auto',
     width: '400px'
 },
 searchBox: {
        padding: '20px 20px 10px 20px'
 }
};

const treeDataStyle = {
    tree: {
            base: {
                listStyle: 'none',
                backgroundColor: '#21252B',
                margin: 0,
                padding: 0,
                color: '#9DA5AB',
                fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
                fontSize: '12px'
            }
    }
};

export const SentimentTreeview = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.getFlux().actions.DASHBOARD.load_sentiment_tree_view();

      return {
          associatedKeywordsChecked: {}
      }
  },
  
  onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
  },
  
  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  changeCheckedStateForChildren(node, cb){
      let self = this;
      cb(node);

      if(node.children && node.children.length > 0){
          node.children.map(item => self.changeCheckedStateForChildren(item, cb));
      }
  },

  directoryEventCount(node){
      let eventCount = 0;
      let self = this;

      if(node.children){
        for(let i in node.children){
            eventCount += self.directoryEventCount(node.children[i]);
        }

        node.eventCount = eventCount;
      }else{
        eventCount += node.checked ? node.eventCount : 0;
      }

      return eventCount;
  },

  onChange(node){
      let folderName = node.folderKey;
      let self = this;
      let associatedKeywords = this.state.associatedKeywordsChecked;
      let checkboxValue = !associatedKeywords[folderName];
      let treeData = this.state.treeData;
      //if a folder is selected, grab the hashtag for all child items.
      this.changeCheckedStateForChildren(node, child => associatedKeywords[child.folderKey] = checkboxValue);
      //traverse from the root down and change the checked state based on associatedKeywords.
      this.changeCheckedStateForChildren(treeData, child => child.checked = associatedKeywords[child.folderKey] || false);
      this.directoryEventCount(treeData);

      this.setState({associatedKeywordsChecked: associatedKeywords,
                     treeData: treeData});
  },

  onFilterMouseUp(e){
        const filter = e.target.value.trim();
        let fullDataset = this.state.sentimentTreeViewData;

        if(!filter){ return this.setState({treeData:fullDataset}); }
        var filtered = filters.filterTree(fullDataset, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({treeData: filtered});
  },

  Header(props) {
        const style = props.style;
        let self = this;
        const iconStyle = { color: '#337ab7' };
        const folderIconStyle = { color: 'rgb(232, 214, 133)' };
        const badgeClass = props.node.checked || (props.node.children && props.node.eventCount > 0) ? "badge" : "badge badge-disabled";

        return (
            <div style={style.base}>
                <div style={style.title}>
                    <input type="checkbox"
                        checked={props.node.checked}
                        onChange={self.onChange.bind(this, props.node)}/>
                        &nbsp;
                        {
                        !props.node.children ? <i className="fa fa-slack fa-1" style={iconStyle}></i> : <i className="fa fa-folder fa-1" style={folderIconStyle}></i>
                        }

                        <span style={{paddingLeft: '3px'}}>{props.node.name}</span>
                        
                        {
                            props.node.eventCount && props.node.eventCount > 0 ? 
                                <span className={badgeClass}>{props.node.eventCount}</span> 
                            : undefined
                        }
                </div>
            </div>
        );   
  },
  
  render(){
     let self = this;
     
     return (
         <div className="panel panel-default">
            <Subheader style={styles.subHeader}>Associated Terms Selector</Subheader>
            <div style={styles.searchBox}>
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"></i>
                        </span>
                        <input type="text"
                            className="form-control"
                            placeholder="Search the association list..."
                            onKeyUp={self.onFilterMouseUp}
                        />
                    </div>
            </div>
            <div className="list-group" data-scrollable="">
                {
                    this.state && this.state.treeData && this.state.treeData.children ? 
                      <div style={styles.component}>  
                        <Treebeard
                            onToggle={this.onToggle}
                            animations={false}
                            style={treeDataStyle}
                            data={this.state.treeData}
                            decorators={Object.assign({}, decorators, {Header: self.Header})} />
                        </div> : undefined
                }
            </div>
         </div>
     );
  }
});
  