import Fluxxor from 'fluxxor';
import { Actions } from '../actions/Actions';

export const AdminStore = Fluxxor.createStore({
    initialize() {
        this.dataStore = {
            settings: {},
            loading: false,
            error: null
        };

        this.bindActions(
            Actions.constants.ADMIN.LOAD_KEYWORDS, this.handleLoadPayload,
            Actions.constants.ADMIN.LOAD_FB_PAGES, this.handleLoadPayload,
            Actions.constants.ADMIN.LOAD_LOCALITIES, this.handleLoadPayload,
            Actions.constants.ADMIN.GET_LANGUAGE, this.handleLoadPayload,
            Actions.constants.ADMIN.GET_TARGET_REGION, this.handleLoadPayload,

            Actions.constants.ADMIN.LOAD_FAIL, this.handleLoadPayloadFail
        );
    },

    getState() {
        return this.dataStore;
    },

    handleLoadPayload(payload) {
        this.dataStore.settings = Object.assign(this.dataStore.settings, payload);
        this.emit("change");
    },

    handleLoadPayloadFail(payload) {
        this.dataStore.error = payload.error;
    }

});