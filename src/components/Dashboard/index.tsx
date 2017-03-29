import * as React from 'react';

import Toolbar from 'react-md/lib/Toolbars';
import { Spinner } from '../Spinner';

import * as ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import ElementConnector from '../ElementConnector';
import { loadDialogsFromDashboard } from '../generic/Dialogs';

import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';

interface IDashboardState {
  mounted?: boolean;
  currentBreakpoint?: string;
  layouts?: ILayouts;
  grid?: any;
}

interface IDashboardProps {
  dashboard?: IDashboardConfig;
}

export default class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  layouts = {};
  
  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: { },
    grid: null
  };

  componentDidMount() {
    let { dashboard } = this.props;
    let { mounted } = this.state;

    if (dashboard && !mounted) {

      const layout = dashboard.config.layout;

      // For each column, create a layout according to number of columns
      var layouts = ElementConnector.loadLayoutFromDashboard(dashboard, dashboard);

      this.layouts = layouts;
      this.setState({ 
        mounted: true,
        layouts: { lg: layouts['lg'] },
        grid: {
          className: 'layout',
          rowHeight: layout.rowHeight || 30,
          cols: layout.cols,
          breakpoints: layout.breakpoints,
          verticalCompact: false
        }
      });
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
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

    let { dashboard } = this.props;
    var { currentBreakpoint, grid } = this.state;
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
