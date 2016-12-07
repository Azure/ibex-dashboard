import Fluxxor from 'fluxxor';
import {Actions} from '../actions/Actions';

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
          locations: new Map(),
          bbox: [],
          colorMap: new Map(),
          selectedLocationCoordinates: [],
          categoryValue: false,
          language: 'ru',
          supportedLanguages:['en', 'ar', "ru"]
      }
      
      this.bindActions(
            Actions.constants.DASHBOARD.CHANGE_SEARCH, this.handleChangeSearchTerm,
            Actions.constants.DASHBOARD.CHANGE_DATE, this.handleChangeDate,
            Actions.constants.DASHBOARD.INITIALIZE, this.intializeDashboard,
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

    intializeDashboard(siteSettings){
        this.dataStore.settings = siteSettings;
        this.emit("change");
    },

    handleDataSourceChange(dataSource){
        this.dataStore.dataSource = dataSource;
        this.dataStore.renderMap = true;
        this.emit("change");
    },

    handleLanguageChange(language){
        this.dataStore.language = language;
        this.emit("change");
    },

    handleChangeColorMap(changedMap){
        this.dataStore.colorMap = changedMap.colorMap;
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
        this.dataStore.categoryValue = changedData.selectedEntity.name;
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
        this.dataStore.locations = heatmapData.locations;
        this.dataStore.renderMap = false;
        this.emit("change");
    }
});