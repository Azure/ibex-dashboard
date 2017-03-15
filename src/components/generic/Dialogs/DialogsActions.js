Object.defineProperty(exports, "__esModule", { value: true });
const alt_1 = require("../../../alt");
class DialogsActions extends alt_1.AbstractActions {
    constructor(alt) {
        super(alt);
    }
    openDialog(dialogName, args) {
        return { dialogName, args };
    }
    closeDialog() {
        return {};
    }
}
const dialogsActions = alt_1.default.createActions(DialogsActions);
exports.default = dialogsActions;
