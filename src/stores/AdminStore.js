import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';

export const AdminStore = Fluxxor.createStore({
    initialize() {
        this.dataStore = {
            settings: {},
            siteList: [],
            loading: false,
            termGridColumns: [],
            watchlist: [],
            action: false,
            error: null
        };

        this.bindActions(
            Actions.constants.ADMIN.LOAD_KEYWORDS, this.handleLoadTerms,
            Actions.constants.ADMIN.LOAD_FB_PAGES, this.handleLoadPayload,
            Actions.constants.ADMIN.LOAD_LOCALITIES, this.handleLoadPayload,
            Actions.constants.ADMIN.GET_LANGUAGE, this.handleLoadPayload,
            Actions.constants.ADMIN.GET_TARGET_REGION, this.handleLoadPayload,
            Actions.constants.ADMIN.LOAD_SETTINGS, this.handleLoadSettings,
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

    handleLoadTerms(response){
        this.dataStore.watchlist = response.response;
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
            columns.push(Object.assign({}, defaultColDef, {key: lang !== "en" ? `name_${lang}` : 'name', 
                                              name: lang !== "en" ? `name_${lang}` : 'name'}))
            
        });
              
        this.dataStore.termGridColumns = columns;
    },

    handleLoadPayloadFail(payload) {
        this.dataStore.error = payload.error;
    }

});