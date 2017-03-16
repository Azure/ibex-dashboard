Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const generic_1 = require("../../../generic");
const DialogsActions_1 = require("./DialogsActions");
const DialogsStore_1 = require("./DialogsStore");
const Dialogs_1 = require("react-md/lib/Dialogs");
const ListItem_1 = require("react-md/lib/Lists/ListItem");
const ReactGridLayout = require("react-grid-layout");
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
class Dialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.layouts = {};
        this.dataSources = {};
        this.onBreakpointChange = (breakpoint) => {
            var layouts = this.state.layouts;
            layouts[breakpoint] = layouts[breakpoint] || this.layouts[breakpoint];
            this.setState({
                currentBreakpoint: breakpoint,
                layouts: layouts
            });
        };
        this.closeDialog = () => {
            DialogsActions_1.default.closeDialog();
        };
        this.openDialog = () => {
            DialogsActions_1.default.openDialog('conversations', { title: this.state.dialogArgs['title'] + ':Blue', intent: 'bla', queryTimespan: 'jjj' });
        };
        this.state = DialogsStore_1.default.getState();
        this.onChange = this.onChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
        // Create dialog data source
        var dialogDS = {
            id: 'dialog_' + this.props.dialogData.id,
            type: 'Constant',
            params: {
                selectedValue: null
            }
        };
        generic_1.PipeComponent.createDataSources({ dataSources: [dialogDS] }, this.dataSources);
        // Adding other data sources
        generic_1.PipeComponent.createDataSources(this.props.dialogData, this.dataSources);
        var layouts = generic_1.Elements.loadLayoutFromDashboard(this.props.dialogData, this.props.dashboard);
        this.layouts = layouts;
        this.state.mounted = false;
        this.state.currentBreakpoint = 'lg';
        this.state.layouts = { lg: layouts['lg'] };
    }
    componentDidMount() {
        this.setState({ mounted: true });
        DialogsStore_1.default.listen(this.onChange);
        generic_1.PipeComponent.connectDataSources(this.dataSources);
    }
    componentDidUpdate() {
        const { dialogData } = this.props;
        var { dialogId, dialogArgs } = this.state;
        var datasourceId = 'dialog_' + dialogData.id;
        this.dataSources[datasourceId].action.updateDependencies(dialogArgs);
    }
    onChange(state) {
        var { dialogId, dialogArgs } = state;
        this.setState({ dialogId, dialogArgs });
    }
    render() {
        const { dialogData, dashboard } = this.props;
        const { id } = dialogData;
        const { dialogId, dialogArgs } = this.state;
        var { title } = dialogArgs || { title: '' };
        var visible = id === dialogId;
        if (!visible) {
            return null;
        }
        var { currentBreakpoint } = this.state;
        var layout = this.state.layouts[currentBreakpoint];
        // Creating visual elements
        var elements = generic_1.Elements.loadElementsFromDashboard(dialogData, layout);
        const items = [
            'Single line text goes here',
            'Two line wrapped text goes here making it wrap to next line',
            'Single line text goes here',
            'Three line wrapped text goes here making it wrap to the next line and continues longer to be here',
            'Single line text goes here',
            'Two line wrapped text goes here making it wrap to next line',
            'Single line text goes here',
            'Three line wrapped text goes here making it wrap to the next line and continues longer to be here',
        ].map((primaryText, i) => (<ListItem_1.default key={i} onClick={this.openDialog} primaryText={primaryText}/>));
        let grid = {
            className: "layout",
            rowHeight: dashboard.config.layout.rowHeight || 30,
            cols: dashboard.config.layout.cols,
            breakpoints: dashboard.config.layout.breakpoints
        };
        return (<Dialogs_1.default id={id} visible={visible} title={title} focusOnMount={false} onHide={this.closeDialog} dialogStyle={{ width: '80%' }} contentStyle={{ padding: '0' }}>
        <ResponsiveReactGridLayout {...grid} layouts={this.state.layouts} onBreakpointChange={this.onBreakpointChange} 
        // WidthProvider option
        measureBeforeMount={false} 
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={this.state.mounted}>
          {elements}
        </ResponsiveReactGridLayout>
      </Dialogs_1.default>);
    }
}
exports.default = Dialog;
