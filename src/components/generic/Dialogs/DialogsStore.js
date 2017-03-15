Object.defineProperty(exports, "__esModule", { value: true });
const alt_1 = require("../../../alt");
const DialogsActions_1 = require("./DialogsActions");
class DialogsStore extends alt_1.AbstractStoreModel {
    constructor() {
        super();
        this.dialogsStack = [];
        this.dialogId = null;
        this.dialogArgs = null;
        this.bindListeners({
            openDialog: DialogsActions_1.default.openDialog,
            closeDialog: DialogsActions_1.default.closeDialog
        });
    }
    openDialog(params) {
        this.dialogsStack.push(params);
        this.dialogId = params.dialogName;
        this.dialogArgs = params.args;
    }
    closeDialog() {
        this.dialogsStack.pop();
        var dialog = this.dialogsStack.length > 0 ?
            this.dialogsStack[this.dialogsStack.length - 1] :
            { dialogName: null, args: null };
        this.dialogId = dialog.dialogName;
        this.dialogArgs = dialog.args;
    }
}
const dialogsStore = alt_1.default.createStore(DialogsStore, "DialogsStore");
exports.default = dialogsStore;
