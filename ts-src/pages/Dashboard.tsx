import * as React from 'react';
import * as _ from 'lodash';
import plugins from '../components/generic/plugins';

import Toolbar from 'react-md/lib/Toolbars';

import * as ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import { PipeComponent, IDataSourceDictionary } from '../generic';

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
    var layouts = {};
    _.each(dashboard.config.layout.cols, (totalColumns, key) => {

      var curCol = 0;
      var curRowOffset = 0;
      var maxRowHeight = 0;

      // Go over all elements in the dashboard and check their size
      dashboard.elements.forEach(element => {
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
    var elements = [];
    var defaultLayout = [];

    dashboard.elements.forEach((element, idx) => {
      var ReactElement = plugins[element.type];
      var { id, dependencies, actions, props, title, subtitle, size } = element;
      var layoutProps = _.find(layout, { "i": id });

      elements.push(
        <div key={id}>
          <ReactElement 
                key={idx} 
                dependencies={dependencies}
                actions={actions}
                props={props}
                title={title}
                subtitle={subtitle}
                layout={layoutProps}
          />
        </div>
      )
    });

    // Creating filter elements
    var filters = [];
    var additionalFilters = [];
    dashboard.filters.forEach((element, idx) => {
      var ReactElement = plugins[element.type];
      (element.first ? filters : additionalFilters).push(
        <ReactElement 
              key={idx} 
              dependencies={element.dependencies}
              actions={element.actions}
        />
      )
    });

    return ( 
      <div style={{ width: '100%' }}>
        <Toolbar>
          {filters}
        </Toolbar>
        <ResponsiveReactGridLayout
          {...this.props.grid}
          layouts={ this.state.layouts }
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}>
          {elements}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
