Object.defineProperty(exports, "__esModule", { value: true });
const alt_1 = require("../../../alt");
const SpinnerActions_1 = require("./SpinnerActions");
class SpinnerStore extends alt_1.AbstractStoreModel {
    constructor() {
        super();
        this.pageLoading = 0;
        this.requestLoading = 0;
        this.bindListeners({
            startPageLoading: SpinnerActions_1.default.startPageLoading,
            endPageLoading: SpinnerActions_1.default.endPageLoading,
            startRequestLoading: SpinnerActions_1.default.startRequestLoading,
            endRequestLoading: SpinnerActions_1.default.endRequestLoading,
        });
    }
    startPageLoading() {
        this.pageLoading++;
    }
    endPageLoading() {
        this.pageLoading--;
    }
    startRequestLoading() {
        this.requestLoading++;
    }
    endRequestLoading() {
        this.requestLoading--;
    }
}
const spinnerStore = alt_1.default.createStore(SpinnerStore, "SpinnerStore");
exports.default = spinnerStore;
