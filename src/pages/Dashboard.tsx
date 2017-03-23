import * as React from 'react';

import Toolbar from 'react-md/lib/Toolbars';
import { Spinner } from '../components/Spinner';

import * as ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import { DataSourceConnector, IDataSourceDictionary } from '../data-sources';
import ElementConnector from '../components/ElementConnector';
import { loadDialogsFromDashboard } from '../components/generic/Dialogs';

import ConfigurationsActions from '../actions/ConfigurationsActions';
import ConfigurationsStore from '../stores/ConfigurationsStore';

interface IDashboardState {
  dashboard?: IDashboardConfig;
  mounted?: boolean;
  currentBreakpoint?: string;
  layouts?: ILayouts;
  grid?: any;
}

export default class Dashboard extends React.Component<any, IDashboardState> {

  layouts = {};
  dataSources: IDataSourceDictionary = {};

  state = {
    dashboard: null,
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: { },
    grid: null
  };

  constructor(props: any) {
    super(props);

    ConfigurationsActions.loadConfiguration();
  }

  componentDidMount() {
    this.setState({ mounted: true });

    let { dashboard } = ConfigurationsStore.getState();
    this.setState({ dashboard });

    ConfigurationsStore.listen(state => {

      let { dashboard } = state;
      
      const layout = dashboard.config.layout;

      DataSourceConnector.createDataSources(dashboard, this.dataSources);
      DataSourceConnector.connectDataSources(this.dataSources);

      // For each column, create a layout according to number of columns
      var layouts = ElementConnector.loadLayoutFromDashboard(dashboard, dashboard);

      this.layouts = layouts;
      this.setState({ 
        dashboard,
        layouts: { lg: layouts['lg'] },
        grid: {
          className: 'layout',
          rowHeight: layout.rowHeight || 30,
          cols: layout.cols,
          breakpoints: layout.breakpoints,
          verticalCompact: false
        }
      });
    })
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

    var { dashboard, currentBreakpoint, grid } = this.state;
    var layout = this.state.layouts[currentBreakpoint];

    if (!grid) {
      return null;
    }

    // Creating visual elements
    var elements = ElementConnector.loadElementsFromDashboard(dashboard, layout);

    // Creating filter elements
    var { filters, /*additionalFilters*/ } = ElementConnector.loadFiltersFromDashboard(dashboard);

    // Loading dialogs
    var dialogs = loadDialogsFromDashboard(dashboard);

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
