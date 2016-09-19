import Fluxxor from 'fluxxor';
import {Actions} from '../actions/Actions';
import * as treeFilters from '../components/TreeFilter';

export const DataStore = Fluxxor.createStore({
    initialize(profile) {
      
      this.dataStore = {
          userProfile: profile,
          timespanType: 'customMonth',
          datetimeSelection: 'March 2016',//moment().format(Actions.constants.TIMESPAN_TYPES.days.format),
          categoryType: 'keyword',
          siteKey: '',
          activities: [],
          action: '',
          popularTerms: [],
          timeSeriesGraphData: {},
          sentimentChartData: [],
          originalTermsTree: [],
          renderMap: true,
          timeseriesFromDate: false,
          filteredTerms: {},
          treeViewStructure: {},
          treeData: {},
          timeseriesToDate: false,
          associatedKeywords: {},
          categoryValue: '',
          defaultResults: []
      }
      
      this.bindActions(
            Actions.constants.ACTIVITY.LOAD_EVENTS, this.handleLoadActivites,
            Actions.constants.DASHBOARD.LOAD, this.handleLoadDefaultSearchResults,
            Actions.constants.DASHBOARD.CHANGE_SEARCH, this.handleChangeSearchTerm,
            Actions.constants.GRAPHING.LOAD_GRAPH_DATA, this.handleLoadGraphData,
            Actions.constants.ACTIVITY.LOAD_SENTIMENT_TREE, this.handleLoadSentimentTreeView,
            Actions.constants.DASHBOARD.CHANGE_DATE, this.handleChangeDate,
            Actions.constants.DASHBOARD.ASSOCIATED_TERMS, this.mapDataUpdate,
            Actions.constants.DASHBOARD.CHANGE_TERM_FILTERS, this.handleChangeTermFilters
      );
    },

    getState() {
        return this.dataStore;
    },
    
    handleLoadActivites(activities){
        this.dataStore.activities = activities.response;
        this.emit("change");
    },
    
    handleLoadGraphData(timeSeries){
        this.refreshGraphData(timeSeries.response);
        this.emit("change");
    },

    handleChangeTermFilters(newFilters){
        this.dataStore.filteredTerms = Object.assign({}, this.dataStore.filteredTerms, newFilters);
        this.dataStore.renderMap = true;
        this.emit("change");
    },
    
    indexTimeSeriesResponse(){
        let self = this;
        this.dataStore.timeSeriesGraphData['aggregatedCounts'] = [];
        let termSummaryMap = new Map();
        let termColorMap = new Map();
        let maxMentionCount = 0;
        let barColors = ['#fdd400', '#84b761', '#b6d2ff', '#CD0D74', '#2f4074'];
        
        if(this.dataStore.timeSeriesGraphData && this.dataStore.timeSeriesGraphData.graphData){
            //hash the time series data by the epoch time as we'll use this to render 
            //the aggregates in the bar chart based on the selected graph zoom area. 
            this.dataStore.timeSeriesGraphData.graphData.forEach(timeEntry => {
                //Aggregate the normalized positive and negative sentiment breakdown as we need the total count for the Histogram.
                let graphEntry = self.aggregateSentimentLevelCounts(timeEntry, termSummaryMap);
                self.dataStore.timeSeriesGraphData.aggregatedCounts.push(graphEntry);
            });

            for (let [term, mentions] of termSummaryMap.entries()) {
                termColorMap.set(term, barColors.pop());

                if(mentions > maxMentionCount){
                    maxMentionCount = mentions;
                    
                    this.dataStore.timeSeriesGraphData['mostPopularTerm'] = term;
                }
            }

            self.dataStore.timeSeriesGraphData.termColorMap = termColorMap;
            self.dataStore.timeSeriesGraphData.termSummaryMap = termSummaryMap;
        }

        return;
    },

    //Based on aggregating off the follwoing sample dataset i.e. [1459605600000, 0, 0, 112, 65, 123, 94, 30, 10, 36, 25, 16, 16], [1459616400000, 0, 0, 142, 75, 83, 41, 44, 10, 60, 48, 13, 10]
    aggregateSentimentLevelCounts(graphDatetimeEntry, termSummaryMap){
        let i = 2, labelIndex = 1;
        let labels = this.dataStore.timeSeriesGraphData.labels;
        let graphEntry = {"date": new Date(graphDatetimeEntry[0])};

        if(graphDatetimeEntry && graphDatetimeEntry.length > 0){
            while(i < graphDatetimeEntry.length - 1){
                let label = labels[labelIndex++];
                graphEntry[label] = graphDatetimeEntry[++i] + graphDatetimeEntry[++i];
                let totalTermMentions = termSummaryMap.get(label);
                termSummaryMap.set(label, (totalTermMentions || 0) + graphEntry[label]);
            }
        }

        return graphEntry;
    },
    
    handleLoadDefaultSearchResults(searchResults){
        this.dataStore.defaultResults = searchResults.response;
        this.dataStore.siteKey = searchResults.siteKey;
        this.emit("change");
    },

    defaultSearchTermToMostMentioned(mostPopularTerm){
        let termSplit = mostPopularTerm.split('-');
        if(termSplit != null && termSplit.length === 2){
                this.dataStore.categoryValue = termSplit[1];
                this.dataStore.categoryType = Actions.constants.CATEGORY_KEY_MAPPING[termSplit[0]];
        }
    },
    
    refreshGraphData(timeSeriesData){
        this.dataStore.timeSeriesGraphData = {
            'labels': timeSeriesData.labels,
            'graphData': timeSeriesData.graphData.sort((a, b) => a[0]>b[0] ? 1 : a[0]<b[0] ? -1 : 0 )
        };

        this.indexTimeSeriesResponse();

        if(this.dataStore.timeSeriesGraphData.aggregatedCounts && this.dataStore.timeSeriesGraphData.aggregatedCounts.length > 0){
           this.defaultSearchTermToMostMentioned(this.dataStore.timeSeriesGraphData.mostPopularTerm);
        }

        this.dataStore.action = 'loadedGraphData';

        return;
    },
    
    handleChangeDate(changedData){
        this.dataStore.datetimeSelection = changedData.datetimeSelection;
        this.dataStore.timespanType = changedData.timespanType;
        this.refreshGraphData(changedData.timeSeriesResponse);
        this.dataStore.filteredTerms = {};
        this.dataStore.renderMap = true;
        this.dataStore.action = 'changedSearchTerms';
        
        this.emit("change");
    },
    
    handleChangeSearchTerm(changedData){
        this.dataStore.categoryValue = changedData.newFilter;
        this.dataStore.categoryType = changedData.searchType;
        this.dataStore.action = 'changedSearchTerms';
        this.dataStore.renderMap = true;
        this.dataStore.filteredTerms = {};
        
        this.emit("change");
    },
    
    handleLoadSentimentTreeView(treeView){
        this.dataStore.treeViewStructure = this.recurseTree(treeView.folderTree);
        this.dataStore.originalTermsTree = this.dataStore.treeViewStructure;
        this.dataStore.treeData = this.dataStore.treeViewStructure;
        this.updateMapAndFilters()

        this.emit("change");
    },

    mapDataUpdate(associatedKeywords){
        this.dataStore.associatedKeywords = associatedKeywords;
        this.dataStore.renderMap = false;
        this.updateMapAndFilters();
    },

    updateMapAndFilters(){
        let self = this;
        let termSuperSet = Object.keys(this.dataStore.associatedKeywords);

        if(termSuperSet.length > 0 && Object.keys(this.dataStore.filteredTerms).length === 0){
            termSuperSet.forEach(term=>this.dataStore.filteredTerms[term] = true);
        }else if(termSuperSet.length === 0){
            this.dataStore.filteredTerms = {};
        }

        if(this.dataStore.treeViewStructure.children && this.dataStore.treeViewStructure.children.length > 0){
            let filtered = treeFilters.filterTreeByMatcher(this.dataStore.treeViewStructure, node => {
                        return termSuperSet.indexOf((node.folderKey || "").toLowerCase()) > -1;
                    },
                    node => Object.assign({}, node, {eventCount: this.dataStore.associatedKeywords[node.folderKey.toLowerCase()], 
                                                     checked: self.dataStore.filteredTerms[node.folderKey.toLowerCase()]}),
                    self.dataStore.filteredTerms);
            
            this.updateTreeEventCount(filtered);
            this.dataStore.originalTermsTree = filtered;
            this.dataStore.treeData = filtered;
            this.emit("change");
        }
    },

    updateTreeEventCount(node){
      let eventCount = 0;
      if(node.children && node.children.length > 0){
        for(let i in node.children){
            if(node.children[i]){
                eventCount += this.updateTreeEventCount(node.children[i]);
            }
        }

        node.eventCount = eventCount;
      }else{
        eventCount += node.checked ? node.eventCount : 0;
      }

      return eventCount;
  },

  recurseTree(dataTree){
      let rootItem = {
          name: 'Associations',
          folderKey: 'associatedKeywords',
          toggled: true,
          children: []
      };

      let recurseChildren = (parentDataFolder, parentListItem, levels) => {
          if(!parentDataFolder){
              return;
          }
          
          for (let [folderKey, subFolder] of parentDataFolder.entries()) {
              let newEntry = {
                  name: subFolder.folderName,
                  folderKey: folderKey,
                  checked: false,
                  parent: parentListItem,
                  eventCount: 0
              };
              
              parentListItem.children.push(newEntry);
              
              if(subFolder.subFolders.size > 0){
                  newEntry.children = [];
                  newEntry.eventCount = 0;
                  recurseChildren(subFolder.subFolders, newEntry, levels + 1);
              }
          }
      };
      
      recurseChildren(dataTree, rootItem, 1);
      
      return rootItem;
  },
});