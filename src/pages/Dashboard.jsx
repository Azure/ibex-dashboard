Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const plugins_1 = require("../components/generic/plugins");
const Toolbars_1 = require("react-md/lib/Toolbars");
const ReactGridLayout = require("react-grid-layout");
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
const generic_1 = require("../generic");
const temp_1 = require("./temp");
const layout = temp_1.default.config.layout;
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.layouts = {};
        this.dataSources = {};
        this.state = {
            currentBreakpoint: 'lg',
            mounted: false,
            layouts: { lg: this.props.initialLayout },
        };
        this.onBreakpointChange = (breakpoint) => {
            var layouts = this.state.layouts;
            layouts[breakpoint] = layouts[breakpoint] || this.layouts[breakpoint];
            this.setState({
                currentBreakpoint: breakpoint,
                layouts: layouts
            });
        };
        this.onLayoutChange = (layout, layouts) => {
            //this.props.onLayoutChange(layout, layouts);
            var breakpoint = this.state.currentBreakpoint;
            var newLayouts = this.state.layouts;
            newLayouts[breakpoint] = layout;
            this.setState({
                layouts: newLayouts
            });
        };
        temp_1.default.dataSources.forEach(source => {
            var dataSource = generic_1.PipeComponent.createDataSource(source);
            this.dataSources[dataSource.id] = dataSource;
        });
        // For each column, create a layout according to number of columns
        var layouts = {};
        _.each(temp_1.default.config.layout.cols, (totalColumns, key) => {
            var curCol = 0;
            var curRowOffset = 0;
            var maxRowHeight = 0;
            // Go over all elements in the dashboard and check their size
            temp_1.default.elements.forEach(element => {
                var { id, size } = element;
                if (curCol > 0 && (curCol + size.w) >= totalColumns) {
                    curCol = 0;
                    curRowOffset = maxRowHeight;
                }
                layouts[key] = layouts[key] || [];
                layouts[key].push({
                    "i": id,
                    "x": curCol,
                    "y": curRowOffset + size.h,
                    "w": size.w,
                    "h": size.h
                });
                curCol += size.w;
                maxRowHeight = Math.max(curRowOffset + size.h, maxRowHeight);
            });
        });
        this.layouts = layouts;
        this.state.layouts = { lg: layouts['lg'] };
    }
    componentDidMount() {
        this.setState({ mounted: true });
        // Connect sources and dependencies
        var sources = Object.keys(this.dataSources);
        sources.forEach(sourceId => {
            var source = this.dataSources[sourceId];
            source.store.listen((state) => {
                sources.forEach(compId => {
                    var compSource = this.dataSources[compId];
                    if (compSource.plugin.getDependencies()[sourceId]) {
                        compSource.action.updateDependencies.defer(state);
                    }
                });
            });
        });
        // Call initalize methods
        sources.forEach(sourceId => {
            var source = this.dataSources[sourceId];
            if (typeof source.action['initialize'] === 'function') {
                source.action.initialize();
            }
        });
    }
    render() {
        var { currentBreakpoint } = this.state;
        var layout = this.state.layouts[currentBreakpoint];
        // Creating visual elements
        var elements = [];
        var defaultLayout = [];
        temp_1.default.elements.forEach((element, idx) => {
            var ReactElement = plugins_1.default[element.type];
            var { id, dependencies, actions, props, title, subtitle, size } = element;
            var layoutProps = _.find(layout, { "i": id });
            elements.push(<div key={id}>
          <ReactElement key={idx} dependencies={dependencies} actions={actions} props={props} title={title} subtitle={subtitle} layout={layoutProps}/>
        </div>);
        });
        // Creating filter elements
        var filters = [];
        var additionalFilters = [];
        temp_1.default.filters.forEach((element, idx) => {
            var ReactElement = plugins_1.default[element.type];
            (element.first ? filters : additionalFilters).push(<ReactElement key={idx} dependencies={element.dependencies} actions={element.actions}/>);
        });
        return (<div style={{ width: '100%' }}>
        <Toolbars_1.default>
          {filters}
        </Toolbars_1.default>
        <ResponsiveReactGridLayout {...this.props.grid} layouts={this.state.layouts} onBreakpointChange={this.onBreakpointChange} onLayoutChange={this.onLayoutChange} 
        // WidthProvider option
        measureBeforeMount={false} 
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={this.state.mounted}>
          {elements}
        </ResponsiveReactGridLayout>
      </div>);
    }
}
// static propTypes = {}
Dashboard.defaultProps = {
    grid: {
        className: "layout",
        rowHeight: layout.rowHeight || 30,
        cols: layout.cols,
        breakpoints: layout.breakpoints
    }
};
exports.default = Dashboard;
