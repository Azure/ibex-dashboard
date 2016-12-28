import Fluxxor from 'fluxxor';
import {Actions} from '../actions/Actions';

const LANGUAGE_CODE_ENG='en';

export const DataStore = Fluxxor.createStore({
    initialize(profile) {
      
      this.dataStore = {
          userProfile: profile,
          timespanType: 'customMonth',
          datetimeSelection: 'November 2016',//moment().format(Actions.constants.TIMESPAN_TYPES.days.format),
          categoryType: '',
          dataSource: 'all',
          settings: {},
          renderMap: true,
          siteKey: '',
          associatedKeywords: new Map(),
          timeSeriesGraphData: {},
          popularLocations: [],
          popularTerms: [],
          termFilters: new Set(),
          allEdges: new Map(),
          bbox: [],
          colorMap: new Map(),
          selectedLocationCoordinates: [],
          categoryValue: false,
          language: 'en'
      }
      
      this.bindActions(
            Actions.constants.DASHBOARD.INITIALIZE, this.intializeSettings,
            Actions.constants.DASHBOARD.RELOAD_CHARTS, this.handleReloadChartData,
            Actions.constants.DASHBOARD.ASSOCIATED_TERMS, this.mapDataUpdate,
            Actions.constants.DASHBOARD.CHANGE_TERM_FILTERS, this.handleChangeTermFilters,
            Actions.constants.DASHBOARD.CHANGE_LANGUAGE, this.handleLanguageChange,
            Actions.constants.DASHBOARD.CLEAR_FILTERS, this.handleClearFilters
      );
    },

    getState() {
        return this.dataStore;
    },

    handleLanguageChange(language){
        this.dataStore.language = language;
        this.emit("change");
    },

    intializeSettings(graphqlResponse){
            if(graphqlResponse.settings.siteDefinition.sites && graphqlResponse.edges){
                this.dataStore.allEdges = new Map();
                const {locations, terms} = graphqlResponse.edges;
                const fullEdgeList = locations.edges.concat(terms.edges);
                const settings = graphqlResponse.settings.siteDefinition.sites[0];

                fullEdgeList.forEach(edge=>{
                    settings.properties.supportedLanguages.forEach(language=>{
                        let languageMap = this.dataStore.allEdges.get(language);
                        if(!languageMap){
                            languageMap = new Map();
                        }
                        
                        const objectKey = language === LANGUAGE_CODE_ENG ? 'name' : `name_${language}`;
                        const defaultEdgeDefintion = Object.assign({}, edge, {name_en: edge.name.toLowerCase(), name: edge.name.toLowerCase()});
                        const edgeTranslations = Object.assign({}, (languageMap.get(edge[objectKey].toLowerCase()) || defaultEdgeDefintion));

                        languageMap.set(edge[objectKey].toLowerCase(), edgeTranslations);

                        this.dataStore.allEdges.set(language, languageMap);
                    });
                });

                this.dataStore.settings = settings;
                this.dataStore.dataSource = graphqlResponse.dataSource;
                this.syncTimeSeriesData(graphqlResponse.timeSeries);
                //set the initial primary term to the most popular.
                if(graphqlResponse.terms.edges && graphqlResponse.terms.edges.length > 0){
                    this.syncPrimaryEdgeData(this.dataStore.allEdges.get(LANGUAGE_CODE_ENG).get(graphqlResponse.terms.edges[0].name), LANGUAGE_CODE_ENG);
                }
                
                this.syncPopularTerms(graphqlResponse.terms.edges || []);
                this.dataStore.popularLocations = graphqlResponse.locations.edges;
            }else{
                console.error('Required data is not available');
            }

            this.emit("change");
    },
    
    handleChangeTermFilters(newFilters){
        let self = this;

        if(Array.isArray(newFilters)){
            for (var [term, value] of self.dataStore.associatedKeywords.entries()) {
                    value.enabled = newFilters.indexOf(term) > -1;
            }
        }
        const newFilterSet = new Set(newFilters);
        //merge the earlier filters with the newly added selections
        this.dataStore.termFilters = new Set([...this.dataStore.termFilters, ...newFilterSet]);
        this.dataStore.renderMap = true;
        this.emit("change");
    },

    syncPrimaryEdgeData(selectedEntity, language){
        let edgeMap = this.dataStore.allEdges.get(language);
        this.dataStore.categoryValue = edgeMap.get(selectedEntity[`name_${language}`]);
        this.dataStore.selectedLocationCoordinates = selectedEntity.coordinates || [];
        this.dataStore.categoryType = selectedEntity.type;
    },

    syncDatetimeState(datetimeSelection, timespanType){
        this.dataStore.associatedKeywords = new Map();
        this.dataStore.datetimeSelection = datetimeSelection;
        this.dataStore.timespanType = timespanType;
    },

    syncTimeSeriesData(mutatedTimeSeries){
        this.dataStore.timeSeriesGraphData = {labels: [], graphData: []};

        if(mutatedTimeSeries && mutatedTimeSeries.graphData && mutatedTimeSeries.labels && mutatedTimeSeries.graphData.length > 0){
            this.dataStore.timeSeriesGraphData = Object.assign({}, {labels: mutatedTimeSeries.labels});
            this.dataStore.timeSeriesGraphData.graphData = mutatedTimeSeries.graphData.map(hourlyAggregate => {
                let graphEntry = Object.assign({}, {date: hourlyAggregate.date});
                hourlyAggregate.edges.forEach((edge, index) => {
                    graphEntry[edge] = hourlyAggregate.mentions[index];
                });

                return graphEntry;
            });
        }
    },

    syncPopularTerms(popularTerms){
        let colorSlices = ['#fdd400', '#84b761', '#b6d2ff', '#CD0D74', '#2f4074', '#7e6596'];
        this.dataStore.colorMap.clear();
        this.dataStore.popularTerms = popularTerms;
        this.dataStore.popularTerms.forEach(term=>{
            this.dataStore.colorMap.set(term.name, colorSlices.pop());
        });
    },

    handleClearFilters(){
        this.dataStore.termFilters.clear();
        this.emit("change");
    },

    handleReloadChartData(changedData){
        const {selectedEntity, datetimeSelection, timespanType, 
               mutatedTimeSeries, popularLocations, popularTerms, dataSource} = changedData;
        this.syncPrimaryEdgeData(selectedEntity, this.dataStore.language);
        this.syncDatetimeState(datetimeSelection, timespanType);
        this.syncTimeSeriesData(mutatedTimeSeries);
        this.dataStore.dataSource = dataSource;
        this.syncPopularTerms(popularTerms.edges || []);
        this.dataStore.popularLocations = popularLocations.edges || [];
        
        this.dataStore.renderMap = true;
        this.emit("change");
    },
    
    mapDataUpdate(heatmapData){
        this.dataStore.associatedKeywords = heatmapData.associatedKeywords;
        this.dataStore.bbox = heatmapData.bbox;
        this.dataStore.renderMap = false;
        this.emit("change");
    }
});