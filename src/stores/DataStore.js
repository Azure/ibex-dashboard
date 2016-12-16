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
          bbox: [],
          colorMap: new Map(),
          selectedLocationCoordinates: [],
          categoryValue: false,
          language: 'en'
      }
      
      this.bindActions(
            Actions.constants.DASHBOARD.CHANGE_SEARCH, this.handleChangeSearchTerm,
            Actions.constants.DASHBOARD.CHANGE_DATE, this.handleChangeDate,
            Actions.constants.DASHBOARD.INITIALIZE, this.intializeSettings,
            Actions.constants.DASHBOARD.ASSOCIATED_TERMS, this.mapDataUpdate,
            Actions.constants.DASHBOARD.CHANGE_COLOR_MAP, this.handleChangeColorMap,
            Actions.constants.DASHBOARD.CHANGE_TERM_FILTERS, this.handleChangeTermFilters,
            Actions.constants.DASHBOARD.CHANGE_SOURCE, this.handleDataSourceChange,
            Actions.constants.DASHBOARD.CHANGE_LANGUAGE, this.handleLanguageChange
      );
    },

    getState() {
        return this.dataStore;
    },
    
    handleLoadActivites(activities){
        this.dataStore.activities = activities.response;
        this.emit("change");
    },

    handleDataSourceChange(dataSource){
        this.dataStore.dataSource = dataSource;
        this.dataStore.renderMap = true;
        this.emit("change");
    },

    handleLanguageChange(language){
        this.dataStore.language = language;
        this.dataStore.renderMap = true;
        this.emit("change");
    },

    handleChangeColorMap(changedMap){
        this.dataStore.colorMap = changedMap.colorMap;
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

        this.dataStore.renderMap = true;
        this.emit("change");
    },
        
    handleChangeDate(changedData){
        this.dataStore.associatedKeywords = new Map();
        this.dataStore.datetimeSelection = changedData.datetimeSelection;
        this.dataStore.timespanType = changedData.timespanType;
        this.dataStore.renderMap = true;
        
        this.emit("change");
    },
    
    handleChangeSearchTerm(changedData){
        this.dataStore.associatedKeywords = new Map();
        this.dataStore.categoryValue = changedData.selectedEntity;
        let language = this.dataStore.language;
        let edgeMap = this.dataStore.allEdges.get(language);
        this.dataStore.categoryValue = edgeMap.get(changedData.selectedEntity[`name_${language}`]);
        this.dataStore.selectedLocationCoordinates = changedData.selectedEntity.coordinates || [];
        this.dataStore.categoryType = changedData.selectedEntity.type;
        this.dataStore.renderMap = true;
        
        if(changedData.colorMap){
            this.dataStore.colorMap = changedData.colorMap;
        }
        
        this.emit("change");
    },
    
    mapDataUpdate(heatmapData){
        this.dataStore.associatedKeywords = heatmapData.associatedKeywords;
        this.dataStore.bbox = heatmapData.bbox;
        this.dataStore.renderMap = false;
        this.emit("change");
    }
});