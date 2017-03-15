Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DialogsActions_1 = require("./DialogsActions");
const DialogsStore_1 = require("./DialogsStore");
const Dialogs_1 = require("react-md/lib/Dialogs");
const List_1 = require("react-md/lib/Lists/List");
const ListItem_1 = require("react-md/lib/Lists/ListItem");
class Dialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.closeDialog = () => {
            DialogsActions_1.default.closeDialog();
        };
        this.openDialog = () => {
            DialogsActions_1.default.openDialog('conversations', { title: this.state.dialogArgs.title + ':Blue', intent: 'bla', queryTimespan: 'jjj' });
        };
        this.state = DialogsStore_1.default.getState();
        this.onChange = this.onChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
    }
    componentDidMount() {
        DialogsStore_1.default.listen(this.onChange);
    }
    onChange(state) {
        var { dialogId, dialogArgs } = state;
        this.setState({ dialogId, dialogArgs });
    }
    render() {
        const { id } = this.props;
        const { dialogId, dialogArgs } = this.state;
        var { title } = dialogArgs || { title: '' };
        var visible = id === dialogId;
        const items = [
            'Single line text goes here',
            'Two line wrapped text goes here making it wrap to next line',
            'Single line text goes here',
            'Three line wrapped text goes here making it wrap to the next line and continues longer to be here',
        ].map((primaryText, i) => (<ListItem_1.default key={i} onClick={this.openDialog} primaryText={primaryText}/>));
        return (<Dialogs_1.default id={id} visible={visible} title={title} onHide={this.closeDialog}>
        <List_1.default>
          {items}
        </List_1.default>
      </Dialogs_1.default>);
    }
}
exports.default = Dialog;
