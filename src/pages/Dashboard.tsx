import * as React from 'react';

import Toolbar from 'react-md/lib/Toolbars';
import { Spinner } from '../components/Spinner';

import * as ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import { loadConfig } from '../components/common';
import { DataSourceConnector, IDataSourceDictionary } from '../data-sources';
import ElementConnector from '../components/ElementConnector';
import { loadDialogsFromDashboard } from '../components/generic/Dialogs';

interface IDashboardState {
  mounted?: boolean;
  currentBreakpoint?: string;
  layouts?: ILayouts;
  grid?: any;
}

export default class Dashboard extends React.Component<any, IDashboardState> {

  layouts = {};
  dataSources: IDataSourceDictionary = {};
  dashboard: IDashboardConfig = null;

  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: { },
    grid: null
  };

  constructor(props: any) {
    super(props);

    // Loading dashboard from 'dashboards' loaded to page
    loadConfig((dashboard: IDashboardConfig) => {

      this.dashboard = dashboard;
      const layout = this.dashboard.config.layout;

      DataSourceConnector.createDataSources(this.dashboard, this.dataSources);
      DataSourceConnector.connectDataSources(this.dataSources);

      // For each column, create a layout according to number of columns
      var layouts = ElementConnector.loadLayoutFromDashboard(this.dashboard, this.dashboard);

      this.layouts = layouts;
      this.setState({ 
        layouts: { lg: layouts['lg'] },
        grid: {
          className: 'layout',
          rowHeight: layout.rowHeight || 30,
          cols: layout.cols,
          breakpoints: layout.breakpoints,
          verticalCompact: false
        }
      });
    });
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  onBreakpointChange = (breakpoint) => {
    var layouts = this.state.layouts;
    layouts[breakpoint] = layouts[breakpoint] || this.layouts[breakpoint];
    this.setState({
      currentBreakpoint: breakpoint,
      layouts: layouts
    });
  }

  onLayoutChange = (layout, layouts) => {
    // this.props.onLayoutChange(layout, layouts);
    var breakpoint = this.state.currentBreakpoint;
    var newLayouts = this.state.layouts;
    newLayouts[breakpoint] = layout;
    this.setState({
      layouts: newLayouts
    });
  }

  render() {

    var { currentBreakpoint, grid } = this.state;
    var layout = this.state.layouts[currentBreakpoint];

    if (!grid) {
      return null;
    }

    // Creating visual elements
    var elements = ElementConnector.loadElementsFromDashboard(this.dashboard, layout);

    // Creating filter elements
    var { filters, /*additionalFilters*/ } = ElementConnector.loadFiltersFromDashboard(this.dashboard);

    // Loading dialogs
    var dialogs = loadDialogsFromDashboard(this.dashboard);

    return (
      <div style={{ width: '100%' }}>
        <Toolbar>
          {filters}
          <Spinner />
        </Toolbar>
        <ResponsiveReactGridLayout
          {...grid}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
        >
          {elements}
        </ResponsiveReactGridLayout>
        {dialogs}
      </div>
    );
  }
}
