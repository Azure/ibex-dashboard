import * as React from 'react';
import * as _ from 'lodash';
import plugins from '../components/generic/plugins';

import Toolbar from 'react-md/lib/Toolbars';

import * as ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import { PipeComponent, IDataSourceDictionary } from '../generic';

const defaultLayouts = { 
  lg: [
    { "i": "timeline",    "x": 0, "y": 8, "w": 5, "h": 8 },
    { "i": "channels",    "x": 5, "y": 8, "w": 3, "h": 8 },
    { "i": "errors",      "x": 8, "y": 8, "w": 2, "h": 8 },
    { "i": "users",       "x": 10, "y": 8, "w": 2, "h": 8 },
    { "i": "intents",     "x": 0, "y": 16, "w": 4, "h": 8 },
    { "i": "conversions", "x": 4, "y": 16, "w": 4, "h": 8 },
    { "i": "sentiments",  "x": 8, "y": 16, "w": 4, "h": 8 }
  ],
  md: [
    { "i": "timeline",    "x": 0, "y": 8, "w": 5, "h": 8 },
    { "i": "channels",    "x": 5, "y": 8, "w": 3, "h": 8 },
    { "i": "errors",      "x": 8, "y": 8, "w": 2, "h": 8 },
    { "i": "users",       "x": 10, "y": 8, "w": 2, "h": 8 },
    { "i": "intents",     "x": 0, "y": 16, "w": 4, "h": 8 },
    { "i": "conversions", "x": 4, "y": 16, "w": 4, "h": 8 },
    { "i": "sentiments",  "x": 8, "y": 16, "w": 4, "h": 8 }
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

import dashboard from './temp';

export default class Dashboard extends React.Component<any, any> {
  // static propTypes = {}

  static defaultProps = {
    grid: {
      className: "layout",
      rowHeight: 30,
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
      layouts: defaultLayouts
    }
  };

  dataSources: IDataSourceDictionary = {};

  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: {lg: this.props.initialLayout},
  };

  getCurrentLayout() {
    var breakpoint = this.state.currentBreakpoint;
    var layout = this.state.layouts[breakpoint] || defaultLayouts[breakpoint];
    return layout;
  }

  constructor(props) {
    super(props);

    dashboard.dataSources.forEach(source => {
      var dataSource = PipeComponent.createDataSource(source);
      this.dataSources[dataSource.id] = dataSource;
    });

    this.getCurrentLayout = this.getCurrentLayout.bind(this);
  }
  
  componentDidMount() {

    this.setState({mounted: true});

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
    this.setState({
      currentBreakpoint: breakpoint
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
    dashboard.elements.forEach((element, idx) => {
      var ReactElement = plugins[element.type];
      var { id, dependencies, actions, props, title, subtitle } = element;
      var layoutProps = _.find(layout, { "i": id });
      elements.push(
        <div key={id}>
          <ReactElement 
                key={idx} 
                dependencies={dependencies}
                actions={actions}
                props={props}
                title={title}
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
