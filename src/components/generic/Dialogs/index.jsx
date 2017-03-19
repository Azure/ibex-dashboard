Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Dialog_1 = require("./Dialog");
const DialogsActions_1 = require("./DialogsActions");
const DialogsStore_1 = require("./DialogsStore");
function loadDialogsFromDashboard(dashboard) {
    if (!dashboard.dialogs) {
        return null;
    }
    var dialogs = dashboard.dialogs.map((dialog, idx) => <Dialog_1.default key={idx} dialogData={dialog} dashboard={dashboard}/>);
    return dialogs;
}
exports.default = {
    loadDialogsFromDashboard,
    Dialog: Dialog_1.default,
    DialogsActions: DialogsActions_1.default,
    DialogsStore: DialogsStore_1.default
};
