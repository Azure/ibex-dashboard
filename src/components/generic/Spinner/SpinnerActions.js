Object.defineProperty(exports, "__esModule", { value: true });
const alt_1 = require("../../../alt");
class SpinnerActions extends alt_1.AbstractActions /*implements ISpinnerActions*/ {
    constructor(alt) {
        super(alt);
        this.generateActions('startPageLoading', 'endPageLoading', 'startRequestLoading', 'endRequestLoading');
    }
}
const spinnerActions = alt_1.default.createActions(SpinnerActions);
exports.default = spinnerActions;
