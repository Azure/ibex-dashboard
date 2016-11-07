import Fluxxor from 'fluxxor';
import Subheader from './Subheader';
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
     width: '100%'
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
                    display: 'inline-flex',
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
                    display: 'inline-flex',
                    verticalAlign: 'top',
                    width: '100%',
                    color: '#9DA5AB'
                },
                baseHighlight: {
                    background: 'rgb(49, 54, 63)',
                    display: 'inline-flex',
                    verticalAlign: 'top',
                    width: '100%',
                    color: '#9DA5AB'
                },
                only: {
                    fontSize: '14px',
                    textDecoration: 'underline',
                    fontWeight: '500'
                },
                badge: {
                    textAlign: 'right',
                    marginRight: '14px'
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
                    display: 'inline-flex',
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
      return {
          treeData: {},
          originalTreeData: {}
      }
  },

  componentWillReceiveProps(nextProps){
      if(this.state.associatedKeywords.size > 0){
          let treeData = this.createRelevantTermsTree(this.state.associatedKeywords);
          this.setState({treeData: treeData, originalTreeData: treeData})
      }
  },

  createRelevantTermsTree(termsMap){
        let rootItem = {
            name: 'Relevant Mentions',
            folderKey: 'associatedKeywords',
            toggled: true,
            children: []
        };

        let noRelevantTermsItemsRoot = {
            name: `None`,
            folderKey: 'noneFolder',
            checked: true,
            toggled: true,
            children: []
        };

        let popularItemsRoot = {
            name: 'Top 5',
            folderKey: 'top5Keywords',
            checked: true,
            toggled: true,
            children: []
        };

        let otherItemsRoot = {
            name: 'Other Terms',
            folderKey: 'otherKeywords',
            checked: true,
            toggled: true,
            children: []
        };

        let itemCount = 0;
        let popularTermsTotal = 0, otherTotal = 0, noneTotal = 0;

        for (var [term, value] of termsMap.entries()) {
            let newEntry = {
                    name: term,
                    folderKey: term,
                    checked: value.enabled,
                    eventCount: value.mentions
            };

            if(term === "none"){
                newEntry.parent = noRelevantTermsItemsRoot;
                noRelevantTermsItemsRoot.children.push(newEntry);
                noneTotal += value.mentions;
            }else if(itemCount++ < 5){
                newEntry.parent = popularItemsRoot;
                popularItemsRoot.children.push(newEntry);
                popularTermsTotal += value.mentions;
            }else{
                newEntry.parent = otherItemsRoot;
                otherItemsRoot.children.push(newEntry);
                otherTotal += value.mentions;
            }
        }

        rootItem.children.push(popularItemsRoot);
        rootItem.children.push(noRelevantTermsItemsRoot);
        rootItem.children.push(otherItemsRoot);
        rootItem.eventCount = popularTermsTotal + otherTotal + noneTotal;

        return rootItem;
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

  changeCheckedStateForChildren(node, filters, cb){
      let self = this;
      cb(node, filters);

      if(node.children && node.children.length > 0){
          node.children.map(item => self.changeCheckedStateForChildren(item, filters, cb));
      }
  },

  onChange(node){
      let filters = this.props.enabledTerms;
      let checkboxActionCB = (nodeElement, filterList) => {
          let addTerm = !nodeElement.checked;
          let termIndex = filterList.indexOf(nodeElement.folderKey);

          if(!addTerm && termIndex > -1){
              filterList.splice(termIndex, 1);
          }else{
              filterList.push(nodeElement.folderKey);
          }
      }

      this.changeCheckedStateForChildren(node, filters, checkboxActionCB);
      this.getFlux().actions.DASHBOARD.changeTermsFilter(filters);
  },

  filterNode(filteredNode){
       let filters = [filteredNode.name];
       this.getFlux().actions.DASHBOARD.changeTermsFilter(filters);
  },

  onFilterMouseUp(e){
        const filter = e.target.value.trim();

        if(!filter){ return this.setState({treeData: this.state.originalTreeData}); }
        var filtered = filters.filterTree(this.state.treeData, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({treeData: filtered});
  },

  changeHighlightedStateForChildren(node, highlightedNodeName){
      let self = this;
      if(node.name === highlightedNodeName){
          node.highlighted = true;
      }else{
          node.highlighted = false;
      }

      if(node.children && node.children.length > 0){
          node.children.map(item => self.changeHighlightedStateForChildren(item, highlightedNodeName));
      }
  },

  onHighlight(node){
      if(!node.children){
        let treeData = this.state.treeData;
        this.changeHighlightedStateForChildren(treeData, node.name);

        this.setState({treeData});
      }
  },

  Header(props) {
        const style = props.style;
        let self = this;
        const termStyle = { paddingLeft: '3px', fontWeight: 800, fontSize: '16px', color: '#337ab7',  width: '100%' };
        const categoryStyle = { paddingLeft: '3px', fontSize: '16px', color: '#fff', fontWeight: 600,  width: '100%'};
        const badgeClass = props.node.checked && props.node.eventCount > 0 ? "badge" : "badge badge-disabled";
        let isNodeTypeCategory = props.node.children && props.node.children.length > 0;
        let onlyLink = <span style={style.only} onClick={this.filterNode.bind(this, props.node)}>only</span>;

        return (
            <div className="row" style={!props.node.highlighted || props.node.children ? style.base : style.baseHighlight} onMouseEnter={this.onHighlight.bind(this, props.node)}>
                <div className="col-md-10" style={style.title}>
                    <input type="checkbox"
                        checked={props.node.checked}
                        onChange={self.onChange.bind(this, props.node)}/>
                    <span style={ !isNodeTypeCategory ? termStyle : categoryStyle }>{(!isNodeTypeCategory ? "#" : "") + props.node.name} </span>
                    {props.node.highlighted ? onlyLink : ""}
                </div>
                <div style={style.badge} className="col-md-2">                    
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