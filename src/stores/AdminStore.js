import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';
// eslint-disable-next-line
import ReactDataGridPlugins from 'react-data-grid-r15/addons';

// eslint-disable-next-line
const Filters = window.ReactDataGridPlugins.Filters;

export const AdminStore = Fluxxor.createStore({
    initialize() {
        this.dataStore = {
            settings: {},
            siteList: [],
            loading: false,
            twitterAccounts: [],
            termGridColumns: [],
            locationGridColumns: [],
            locations: [],
            watchlist: [],
            action: false,
            error: null
        };

        this.bindActions(
            Actions.constants.ADMIN.LOAD_KEYWORDS, this.handleLoadTerms,
            Actions.constants.ADMIN.LOAD_FB_PAGES, this.handleLoadPayload,
            Actions.constants.ADMIN.LOAD_LOCALITIES, this.handleLoadLocalities,
            Actions.constants.ADMIN.GET_LANGUAGE, this.handleLoadPayload,
            Actions.constants.ADMIN.GET_TARGET_REGION, this.handleLoadPayload,
            Actions.constants.ADMIN.LOAD_SETTINGS, this.handleLoadSettings,
            Actions.constants.ADMIN.LOAD_TWITTER_ACCTS, this.handleLoadTwitterAccts,
            Actions.constants.ADMIN.LOAD_FAIL, this.handleLoadPayloadFail,
            Actions.constants.ADMIN.CREATE_SITE, this.handleCreateSite
        );
    },

    getState() {
        return this.dataStore;
    },

    handleLoadPayload(payload) {
        this.dataStore.settings = Object.assign(this.dataStore.settings, payload);
        this.emit("change");
    },

    handleLoadTwitterAccts(response){
        this.dataStore.twitterAccounts = response.streams.accounts;
        this.dataStore.action = response.action || false;
        this.emit("change");
    },

    handleLoadTerms(response){
        this.dataStore.watchlist = response.response;
        this.dataStore.action = response.action || false;
        this.emit("change");
    },

    handleLoadLocalities(response){
        this.dataStore.locations = response.response.map(location => {
            return Object.assign({}, location, {coordinates: location.coordinates.join(",")});
        });
        this.dataStore.action = response.action || false;
        this.emit("change");
    },

    handleCreateSite(response){
        const {siteName, action} = response;
        this.dataStore.siteList.push({name: siteName});
        this.dataStore.action = action;
        this.emit("change");
    },

    handleLoadSettings(response){
        const {settings, action, siteList, originalSiteName} = response;
        this.dataStore.settings = settings;
        this.dataStore.action = action;
        if(!siteList){
            this.dataStore.siteList = this.dataStore.siteList.map(site => {
                if(site.name === originalSiteName){
                    return Object.assign({}, site, {name: settings.name});
                }else{
                    return site;
                }
            });
        }else{
            this.dataStore.siteList = siteList;
        }
        
        this.loadTermColumns(settings.properties.supportedLanguages);
        this.loadLocalitiesColumns(settings.properties.supportedLanguages);
        this.emit("change");
    },

    loadLocalitiesColumns(languages){
        const defaultColDef = {
                    editable:true,
                    sortable : true,
                    filterable: true,
                    resizable: true
        };
        let columns = [];
        columns.push(Object.assign({}, defaultColDef, {filterable: false, compositeKey: true, editable: false, key: "RowKey", name: "GeonameId"}));
        languages.forEach(lang => {
            columns.push(Object.assign({}, defaultColDef, {
                                                           compositeKey: true, 
                                                           key: lang !== "en" ? `name_${lang}` : 'name', 
                                                           name: lang !== "en" ? `name_${lang}` : 'name'
                                                          }))            
        });
        columns.push(Object.assign({}, defaultColDef, {filterable: true, editable: true, key: "region", name: "Region"}));
        columns.push(Object.assign({}, defaultColDef, {filterable: false, editable: true, key: "alternatenames", name: "Alternate Name(s)"}));
        columns.push(Object.assign({}, defaultColDef, {filterable: true, editable: false, key: "country_iso", name: "Country Code"}));
        columns.push(Object.assign({}, defaultColDef, {filterable: false, editable: false, key: "coordinates", name: "Coordinates"}));
        columns.push(Object.assign({}, defaultColDef, {filterable: true, editable: true, key: "aciiname", name: "Ascii Name"}));
        columns.push(Object.assign({}, defaultColDef, {key: "population", name: "Population", filterRenderer: Filters.NumericFilter}));

        this.dataStore.locationGridColumns = columns;
        this.emit("change");
    },

    loadTermColumns(languages){
        const defaultColDef = {
                    editable:true,
                    sortable : true,
                    filterable: true,
                    resizable: true
        };
        let columns = [];
        columns.push(Object.assign({}, defaultColDef, {editable: false, key: "RowKey", name: "Term ID"}));
        languages.forEach(lang => {
            columns.push(Object.assign({}, defaultColDef, {
                                                           compositeKey: true, 
                                                           key: lang !== "en" ? `name_${lang}` : 'name', 
                                                           name: lang !== "en" ? `name_${lang}` : 'name'
                                                          }))
        });
              
        this.dataStore.termGridColumns = columns;
    },

    handleLoadPayloadFail(payload) {
        this.dataStore.error = payload.error;
    }

});