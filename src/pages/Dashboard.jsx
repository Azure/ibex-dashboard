var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var _ = require("lodash");
var plugins_1 = require("../components/generic/plugins");
var Toolbars_1 = require("react-md/lib/Toolbars");
var ReactGridLayout = require("react-grid-layout");
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
var generic_1 = require("../generic");
var defaultLayouts = {
    lg: [
        { "i": "timeline", "x": 0, "y": 8, "w": 5, "h": 8 },
        { "i": "channels", "x": 5, "y": 8, "w": 3, "h": 8 },
        { "i": "errors", "x": 8, "y": 8, "w": 2, "h": 8 },
        { "i": "users", "x": 10, "y": 8, "w": 2, "h": 8 },
        { "i": "intents", "x": 0, "y": 16, "w": 4, "h": 8 },
        { "i": "conversions", "x": 4, "y": 16, "w": 4, "h": 8 },
        { "i": "sentiments", "x": 8, "y": 16, "w": 4, "h": 8 }
    ],
    md: [
        { "i": "timeline", "x": 0, "y": 8, "w": 5, "h": 8 },
        { "i": "channels", "x": 5, "y": 8, "w": 3, "h": 8 },
        { "i": "errors", "x": 8, "y": 8, "w": 2, "h": 8 },
        { "i": "users", "x": 10, "y": 8, "w": 2, "h": 8 },
        { "i": "intents", "x": 0, "y": 16, "w": 4, "h": 8 },
        { "i": "conversions", "x": 4, "y": 16, "w": 4, "h": 8 },
        { "i": "sentiments", "x": 8, "y": 16, "w": 4, "h": 8 }
    ],
    sm: [
        { "x": 0, "y": 8, "w": 5, "h": 8, "i": "0" },
        { "x": 5, "y": 8, "w": 5, "h": 8, "i": "1" },
        { "x": 10, "y": 8, "w": 2, "h": 8, "i": "2" },
        { "x": 0, "y": 16, "w": 5, "h": 8, "i": "3" }
    ],
    xs: [
        { "x": 0, "y": 8, "w": 5, "h": 8, "i": "0" },
        { "x": 5, "y": 8, "w": 5, "h": 8, "i": "1" },
        { "x": 10, "y": 8, "w": 2, "h": 8, "i": "2" },
        { "x": 0, "y": 16, "w": 5, "h": 8, "i": "3" }
    ],
    xxs: [
        { "x": 0, "y": 8, "w": 5, "h": 8, "i": "0" },
        { "x": 5, "y": 8, "w": 5, "h": 8, "i": "1" },
        { "x": 10, "y": 8, "w": 2, "h": 8, "i": "2" },
        { "x": 0, "y": 16, "w": 5, "h": 8, "i": "3" }
    ]
};
var temp_1 = require("./temp");
var Dashboard = (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard(props) {
        var _this = _super.call(this, props) || this;
        _this.dataSources = {};
        _this.state = {
            currentBreakpoint: 'lg',
            mounted: false,
            layouts: { lg: _this.props.initialLayout },
        };
        _this.onBreakpointChange = function (breakpoint) {
            _this.setState({
                currentBreakpoint: breakpoint
            });
        };
        _this.onLayoutChange = function (layout, layouts) {
            //this.props.onLayoutChange(layout, layouts);
            var breakpoint = _this.state.currentBreakpoint;
            var newLayouts = _this.state.layouts;
            newLayouts[breakpoint] = layout;
            _this.setState({
                layouts: newLayouts
            });
        };
        temp_1.default.dataSources.forEach(function (source) {
            var dataSource = generic_1.PipeComponent.createDataSource(source);
            _this.dataSources[dataSource.id] = dataSource;
        });
        _this.getCurrentLayout = _this.getCurrentLayout.bind(_this);
        return _this;
    }
    Dashboard.prototype.getCurrentLayout = function () {
        var breakpoint = this.state.currentBreakpoint;
        var layout = this.state.layouts[breakpoint] || defaultLayouts[breakpoint];
        return layout;
    };
    Dashboard.prototype.componentDidMount = function () {
        var _this = this;
        this.setState({ mounted: true });
        // Connect sources and dependencies
        var sources = Object.keys(this.dataSources);
        sources.forEach(function (sourceId) {
            var source = _this.dataSources[sourceId];
            source.store.listen(function (state) {
                sources.forEach(function (compId) {
                    var compSource = _this.dataSources[compId];
                    if (compSource.plugin.getDependencies()[sourceId]) {
                        compSource.action.updateDependencies.defer(state);
                    }
                });
            });
        });
        // Call initalize methods
        sources.forEach(function (sourceId) {
            var source = _this.dataSources[sourceId];
            if (typeof source.action['initialize'] === 'function') {
                source.action.initialize();
            }
        });
    };
    Dashboard.prototype.render = function () {
        var currentBreakpoint = this.state.currentBreakpoint;
        var layout = this.state.layouts[currentBreakpoint];
        // Creating visual elements
        var elements = [];
        temp_1.default.elements.forEach(function (element, idx) {
            var ReactElement = plugins_1.default[element.type];
            var id = element.id, dependencies = element.dependencies, actions = element.actions, props = element.props, title = element.title, subtitle = element.subtitle;
            var layoutProps = _.find(layout, { "i": id });
            elements.push(<div key={id}>
          <ReactElement key={idx} dependencies={dependencies} actions={actions} props={props} title={title} layout={layoutProps}/>
        </div>);
        });
        // Creating filter elements
        var filters = [];
        var additionalFilters = [];
        temp_1.default.filters.forEach(function (element, idx) {
            var ReactElement = plugins_1.default[element.type];
            (element.first ? filters : additionalFilters).push(<ReactElement key={idx} dependencies={element.dependencies} actions={element.actions}/>);
        });
        return (<div style={{ width: '100%' }}>
        <Toolbars_1.default>
          {filters}
        </Toolbars_1.default>
        <ResponsiveReactGridLayout {...this.props.grid} onBreakpointChange={this.onBreakpointChange} onLayoutChange={this.onLayoutChange} 
        // WidthProvider option
        measureBeforeMount={false} 
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={this.state.mounted}>
          {elements}
        </ResponsiveReactGridLayout>
      </div>);
    };
    return Dashboard;
}(React.Component));
// static propTypes = {}
Dashboard.defaultProps = {
    grid: {
        className: "layout",
        rowHeight: 30,
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        layouts: defaultLayouts
    }
};
exports.default = Dashboard;
