import Fluxxor from 'fluxxor';
import Subheader from './Subheader';
import {TermFilter} from './TermFilter';
import React from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import * as filters from './TreeFilter';
import {TypeaheadSearch} from './TypeaheadSearch';
import '../styles/Header.css';
import '../styles/SentimentTreeView.css';

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
        padding: '0px 20px 10px 20px'
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
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#31363F'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#9DA5AB'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
};

decorators.Toggle = (props) => {
      let isNodeTypeCategory = props.node && props.node.children && props.node.children.length > 0;
      let iconComponent = <div/>;
      let iconStyle = {color: '#fff'};
      const style = props.style;

      if(isNodeTypeCategory){
          iconComponent = props.node.toggled ? <i className="fa fa-plus fa-1" style={iconStyle}></i> : <i className="fa fa-minus fa-1" style={iconStyle}></i>;
      }

      return (
        <div style={style.base}>
            <div style={style.wrapper}>
                {iconComponent}
            </div>
        </div>
      );
};

decorators.Toggle.propTypes = {
    style: React.PropTypes.object
};

export const SentimentTreeview = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      let siteKey = this.props.siteKey;

      this.getFlux().actions.DASHBOARD.load_sentiment_tree_view(siteKey);

      return {}
  },
  
  onToggle(node, toggled){
        // eslint-disable-next-line      
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

  onChange(node){
      let filters = this.state.filteredTerms;
      this.changeCheckedStateForChildren(node, child => filters[child.folderKey] = !filters[child.folderKey]);
      this.getFlux().actions.DASHBOARD.changeTermsFilter(filters);
  },

  onFilterMouseUp(e){
        const filter = e.target.value.trim();
        let fullDataset = this.state.originalTermsTree;

        if(!filter){ return this.setState({treeData:fullDataset}); }
        var filtered = filters.filterTree(fullDataset, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({treeData: filtered});
  },

  Header(props) {
        const style = props.style;
        let self = this;
        const termStyle = { paddingLeft: '3px', fontWeight: 800, color: '#337ab7' };
        const categorytyle = { paddingLeft: '3px', fontSize: '13px', color: '#fff', fontWeight: 600};
        const badgeClass = props.node.checked && props.node.children && props.node.eventCount > 0 ? "badge" : "badge badge-disabled";
        let isNodeTypeCategory = props.node.children && props.node.children.length > 0;

        return (
            <div style={style.base}>
                <div style={style.title}>
                    <input type="checkbox"
                        checked={props.node.checked}
                        onChange={self.onChange.bind(this, props.node)}/>
                        <span style={ !isNodeTypeCategory ? termStyle : categorytyle }>{(!isNodeTypeCategory ? "#" : "") + props.node.name}</span>
                        {
                            props.node.eventCount && props.node.eventCount > 0 ? 
                                <span className={badgeClass}>{props.node.eventCount}</span> 
                            : undefined
                        }
                </div>
            </div>
        );   
  },

  Toggle(props){
      let isNodeTypeCategory = props.node && props.node.children && props.node.children.length > 0;
      let iconComponent = {};
      let iconStyle = {color: '#fff'};
      const style = props.style;

      if(isNodeTypeCategory){
          iconStyle = props.node.toggled ? <i className="fa fa-plus fa-1" style={iconStyle}></i> : <i className="fa fa-minus fa-1" style={iconStyle}></i>;
      }

      return (
        <div style={style.base}>
            <div style={style.wrapper}>
                {iconComponent}
            </div>
        </div>
      );
 },
  
 render(){
     let self = this;
     let defaultSearchPlaceholder = "#" + this.state.categoryValue;

     return (
         <div className="panel panel-selector">
            <Subheader style={styles.subHeader}>Heatmap Terms</Subheader>
            <div className="row tagFilterRow">
                <TypeaheadSearch data={defaultSearchPlaceholder}/>
            </div>
            <div className="row tagFilterRow">
                <TermFilter data={this.state.associatedKeywords ? Object.keys(this.state.associatedKeywords) : [] } />
            </div>
            <div style={styles.searchBox}>
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-filter"></i>
                        </span>
                        <input type="text"
                            className="form-control"
                            placeholder="Search the association list..."
                            onKeyUp={self.onFilterMouseUp} />
                    </div>
            </div>
            <div className="list-group" data-scrollable="">
                {
                    this.state && this.state.treeData && this.state.treeData.children ? 
                      <div style={styles.component}>  
                        <Treebeard
                            onToggle={this.onToggle}
                            animations={false}
                            data={this.state.treeData}
                            style={treeDataStyle}
                            decorators={Object.assign({}, decorators, {Header: self.Header})} />
                        </div> : undefined
                }
            </div>
         </div>
     );
  }
});