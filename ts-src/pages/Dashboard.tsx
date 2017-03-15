import * as React from 'react';
import * as _ from 'lodash';
import plugins from '../components/generic/plugins';

import Toolbar from 'react-md/lib/Toolbars';

import * as ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import { PipeComponent, IDataSourceDictionary, Elements } from '../generic';

import dashboard from './temp';
const layout = dashboard.config.layout;

interface IDashboardState {
  mounted?: boolean,
  currentBreakpoint?: string,
  layouts?: ILayouts
}

export default class Dashboard extends React.Component<any, IDashboardState> {
  // static propTypes = {}

  static defaultProps = {
    grid: {
      className: "layout",
      rowHeight: layout.rowHeight || 30,
      cols: layout.cols,
      breakpoints: layout.breakpoints
    }
  };

  layouts = {};
  dataSources: IDataSourceDictionary = {};

  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: {lg: this.props.initialLayout},
  };

  constructor(props) {
    super(props);

    dashboard.dataSources.forEach(source => {
      var dataSource = PipeComponent.createDataSource(source);
      this.dataSources[dataSource.id] = dataSource;
    });

    // For each column, create a layout according to number of columns
    var layouts = Elements.loadLayoutFromDashboard(dashboard);
    
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

  onBreakpointChange = (breakpoint) => {
    var layouts = this.state.layouts;
    layouts[breakpoint] = layouts[breakpoint] || this.layouts[breakpoint];
    this.setState({
      currentBreakpoint: breakpoint,
      layouts: layouts
    });
  };

  onLayoutChange = (layout, layouts) => {
    //this.props.onLayoutChange(layout, layouts);
    var breakpoint = this.state.currentBreakpoint;
    var newLayouts = this.state.layouts;
    newLayouts[breakpoint] = layout;
    this.setState({
      layouts: newLayouts
    });
  };

  render() {

    var { currentBreakpoint } = this.state;
    var layout = this.state.layouts[currentBreakpoint];

    // Creating visual elements
    var elements = Elements.loadElementsFromDashboard(dashboard, layout)

    // Creating filter elements
    var { filters, additionalFilters } = Elements.loadFiltersFromDashboard(dashboard);

    // Loading dialogs
    var dialogs = Elements.loadDialogsFromDashboard(dashboard);

    return ( 
      <div style={{ width: '100%' }}>
        <Toolbar>
          { filters }
        </Toolbar>
        <ResponsiveReactGridLayout
          { ...this.props.grid }
          layouts={ this.state.layouts }
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}>
          { elements }
        </ResponsiveReactGridLayout>
        { dialogs }
      </div>
    );
  }
}
