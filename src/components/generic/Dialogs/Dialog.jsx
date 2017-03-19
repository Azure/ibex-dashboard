Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const data_sources_1 = require("../../../data-sources");
const ElementConnector_1 = require("../../ElementConnector");
const DialogsActions_1 = require("./DialogsActions");
const DialogsStore_1 = require("./DialogsStore");
const Dialogs_1 = require("react-md/lib/Dialogs");
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
        data_sources_1.DataSourceConnector.createDataSources({ dataSources: [dialogDS] }, this.dataSources);
        // Adding other data sources
        data_sources_1.DataSourceConnector.createDataSources(this.props.dialogData, this.dataSources);
        var layouts = ElementConnector_1.default.loadLayoutFromDashboard(this.props.dialogData, this.props.dashboard);
        this.layouts = layouts;
        this.state.mounted = false;
        this.state.currentBreakpoint = 'lg';
        this.state.layouts = { lg: layouts['lg'] };
    }
    componentDidMount() {
        this.setState({ mounted: true });
        DialogsStore_1.default.listen(this.onChange);
        data_sources_1.DataSourceConnector.connectDataSources(this.dataSources);
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
        var elements = ElementConnector_1.default.loadElementsFromDashboard(dialogData, layout);
        let grid = {
            className: "layout",
            rowHeight: dashboard.config.layout.rowHeight || 30,
            cols: dashboard.config.layout.cols,
            breakpoints: dashboard.config.layout.breakpoints
        };
        return (<Dialogs_1.default id={id} visible={visible} title={title} focusOnMount={false} onHide={this.closeDialog} dialogStyle={{ width: dialogData.width || '80%' }} contentStyle={{ padding: '0', maxHeight: 'calc(100vh - 148px)' }}>
        
          {elements}
        
      </Dialogs_1.default>);
    }
}
exports.default = Dialog;
