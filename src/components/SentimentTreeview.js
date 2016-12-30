import Fluxxor from 'fluxxor';
import Subheader from './Subheader';
import React from 'react';
import {Treebeard, decorators} from 'react-treebeard';
import * as filters from './TreeFilter';
import {TypeaheadSearch} from './TypeaheadSearch';
import '../styles/Header.css';
import '../styles/SentimentTreeView.css';
import numeralLibs from 'numeral';

const FluxMixin = Fluxxor.FluxMixin(React),
      parentTermsName = "Term Filters",
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      DEFAULT_LANGUAGE = "en";

const styles = {
  subHeader: {
    color:'#fff',
    paddingLeft: '11px',
    fontSize: '18px',
    fontWeight: 700
  },
  component: {
     display: 'block',
     verticalAlign: 'top',
     width: '100%'
  },
  searchBox: {
     padding: '0px 20px 10px 20px'
  },
  subHeaderDescription: {
      color: '#a3a3b3',
      fontSize: '8px',
      fontWeight: 800,
      paddingLeft: '4px'
  },
  titleSpan: {
      paddingRight: '8px'
  }
};
 
const treeDataStyle = {
     tree: {
        base: {
                listStyle: 'none',
                backgroundColor: 'rgb(63, 63, 79)',
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
                parentBadge: {
                    marginRight: '28px',
                    textAlign: 'right',
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
                    display: 'inline-table',
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

export const SentimentTreeview = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.totalMentionCount = 0;
      this.visibleMentionCount = 0;

      return {
          treeData: {},
          originalTreeData: {}
      }
  },

  hasChanged(){
      const {associatedKeywords} = this.getStateFromFlux();
      let totalMentionCount = 0, visibleMentionCount = 0;

      // eslint-disable-next-line
      for (let [term, value] of associatedKeywords.entries()) {
          if(value.enabled){
                visibleMentionCount += value.mentions;
          }
          totalMentionCount += value.mentions;
      }

      if(this.totalMentionCount !== totalMentionCount || this.visibleMentionCount !== visibleMentionCount){
          this.totalMentionCount = totalMentionCount;
          this.visibleMentionCount = visibleMentionCount;

          return true;
      }else{
          return false;   
      }
  },

  componentWillReceiveProps(nextProps){
      if(this.hasChanged() || this.props.language !== nextProps.language){
            const {associatedKeywords} = this.getStateFromFlux();
            let treeData = this.createRelevantTermsTree(associatedKeywords, nextProps.language);
            this.setState({treeData: treeData, originalTreeData: treeData})
      }
  },

  createRelevantTermsTree(termsMap, lang){
        let rootItem = {
            name: parentTermsName,
            folderKey: 'associatedKeywords',
            toggled: true,
            children: []
        };

        let popularItemsRoot = {
            name: 'Top 5 Terms',
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
        let popularTermsTotal = 0, otherTotal = 0;

        for (var [term, value] of termsMap.entries()) {
            let newEntry = Object.assign({}, value, {
                    name: value["name_"+lang],
                    folderKey: term,
                    checked: value.enabled,
                    eventCount: value.mentions
            });
            if(term !== "none" && itemCount++ < 5){
                newEntry.parent = popularItemsRoot;
                popularItemsRoot.children.push(newEntry);
                popularTermsTotal += value.enabled ? value.mentions : 0;
            }else if(term !== "none"){
                newEntry.parent = otherItemsRoot;
                otherItemsRoot.children.push(newEntry);
                otherTotal += value.enabled ? value.mentions : 0;
            }
        }
        
        if(popularItemsRoot.children < 5){
            popularItemsRoot.name = "Terms";
        }

        rootItem.children.push(popularItemsRoot);

        if(otherItemsRoot.children.length > 0){
            rootItem.children.push(otherItemsRoot);
        }
        
        rootItem.eventCount = popularTermsTotal + otherTotal;

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
      let filters = this.props.enabledTerms.map(filter=>Object.assign({}, {term: filter, action: 'add'}));
      let checkboxActionCB = (nodeElement, filterList) => {
          let addTerm = !nodeElement.checked;
          let termIndex = filterList.findIndex(filter=>filter.term === nodeElement.folderKey);

          //you're selecting to remove the enabled filter
          if(!addTerm && termIndex > -1){
              let mutatedFilter = Object.assign({}, filterList[termIndex], {action: 'remove'});
              filterList[termIndex] = mutatedFilter;
          }else{
              filterList.push({term: nodeElement.folderKey, action: 'add'});
          }
      }

      this.changeCheckedStateForChildren(node, filters, checkboxActionCB);
      this.getFlux().actions.DASHBOARD.changeTermsFilter(filters);
  },

  filterNode(filteredNode){
       let filters = [filteredNode[`name_${DEFAULT_LANGUAGE}`]];
       this.getFlux().actions.DASHBOARD.changeTermsFilterToOnly(filters);
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

  termSelected(node){
      if(!node.children){
          node['type']="Term";
          this.getFlux().actions.DASHBOARD.reloadVisualizationState(this.props.siteKey, this.state.datetimeSelection, 
                                                                    this.state.timespanType, this.state.dataSource, node);
      }
  },

  Header(props) {
        const style = props.style;
        let self = this;
        const termStyle = { paddingLeft: '3px', fontWeight: 800, fontSize: '14px', color: '#337ab7',  width: '100%' };
        const categoryStyle = { paddingLeft: '3px', fontSize: '14px', color: '#fff', display: 'inline-table', fontWeight: 600}; 
        let badgeClass = (props.node.checked || props.node.children) && props.node.eventCount > 0 ? "badge" : "badge badge-disabled";
        let isNodeTypeCategory = props.node.children && props.node.children.length > 0;
        let onlyLink = <span style={style.only} onClick={this.filterNode.bind(this, props.node)}>only</span>;
        let termClassName = !isNodeTypeCategory ? "relevantTerm" : "";

        return (
            <div className="row" style={!props.node.highlighted || props.node.children ? style.base : style.baseHighlight} onMouseEnter={this.onHighlight.bind(this, props.node)}>
                <div className="col-md-10" style={style.title}>
                    <input type="checkbox"
                        checked={props.node.checked}
                        onChange={self.onChange.bind(this, props.node)}/>
                    <span className={termClassName} onClick={()=>this.termSelected(props.node)} style={ !isNodeTypeCategory ? termStyle : categoryStyle }>{props.node.name} </span>
                    {props.node.highlighted ? onlyLink : ""}
                </div>
                <div style={props.node.name === parentTermsName ? style.parentBadge : style.badge} className="col-md-2">
                            {
                                props.node.eventCount && props.node.eventCount > 0 ? 
                                    <span className={badgeClass}>{numeralLibs(props.node.eventCount).format(props.node.eventCount > 1000 ? '+0.0a' : '0a')}</span> 
                                : undefined
                            }
                </div>
            </div>
        );   
  },

  Toggle(props){
      let iconComponent = {};
      const style = props.style;

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

     return (
         <div className="panel panel-selector">
            <Subheader style={styles.subHeader}>
               <span style={styles.titleSpan}>WATCHLIST TERMS</span>
               {
                  this.props.enabledTerms.length > 0 ? 
                   <button type="button" onClick={()=>this.getFlux().actions.DASHBOARD.clearWatchlistFilters()} className="btn btn-primary btn-sm">Clear Selections</button>
                  : undefined
               }                
            </Subheader>
            <div style={styles.searchBox}>
                <TypeaheadSearch data={this.state.categoryValue["name_"+this.props.language]}
                                type={this.state.categoryType}
                                siteKey={this.props.siteKey}
                                dataSource={this.state.dataSource}
                                language={this.state.language}
                                datetimeSelection={this.state.datetimeSelection}
                                timespanType={this.state.timespanType}/>
            </div>
            <div style={styles.searchBox}>
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-filter"></i>
                        </span>
                        <input type="text"
                            className="form-control edgeFilterInput"
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
                            siteKey={this.props.siteKey}
                            decorators={Object.assign({}, decorators, {Header: self.Header})} />
                        </div> : undefined
                }
            </div>
         </div>
     );
  }
});