import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

//import {Container, Grid, Breakpoint, Span} from 'react-responsive-grid'
import ReactGridLayout from 'react-grid-layout';
var ResponsiveReactGridLayout = ReactGridLayout.Responsive;
var WidthProvider = ReactGridLayout.WidthProvider;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

import Timeline from './Graphs/Timeline';
import ChannelsPie from './Graphs/ChannelsPie';
import IntentsGraph from './Graphs/IntentsGraph';
import ConversionPie from './Graphs/ConversionPie';
import SentimentPie from './Graphs/SentimentPie';
import Timespan from './Timespan';
import Errors from './Errors';
import Users from './Users';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css'
import './style.css';

function generateLayouts() {

  return { 
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
      { "x": 0, "y": 8, "w": 5, "h": 8, "i": "0" },
      { "x": 5, "y": 8, "w": 5, "h": 8, "i": "1" },
      { "x": 10, "y": 8, "w": 2, "h": 8, "i": "2" },
      { "x": 0, "y": 16, "w": 5, "h": 8, "i": "3" }
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
  }
}


export default class Dashboard extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static defaultProps = {
    grid: {
      className: "layout",
      rowHeight: 30,
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
      layouts: generateLayouts()
    }
  };

  state = {
    currentBreakpoint: 'lg',
    mounted: false,
    layouts: {lg: this.props.initialLayout},
  };
  
  componentDidMount() {
    this.setState({mounted: true});
  }

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onLayoutChange = (layout, layouts) => {
    //this.props.onLayoutChange(layout, layouts);
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('Dashboard', className)}>
        <Timespan />
        <ResponsiveReactGridLayout
          {...this.props.grid}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}>
          <div key='timeline'><Timeline /></div>
          <div key='channels'><ChannelsPie /></div>
          <div key='errors'><Errors /></div>
          <div key='users'><Users /></div>
          <div key='intents'><IntentsGraph /></div>
          <div key='conversions'><ConversionPie /></div>
          <div key='sentiments'><SentimentPie /></div>
        </ResponsiveReactGridLayout>
      </div>
    )

    // return (
    //     <Timespan />
    //     <Grid columns={12} className='dashboard-grid'>
    //       <Breakpoint minWidth={1600}>
    //         <Span columns={5}><Timeline /></Span>

    //         <Span columns={5}><ChannelsPie /></Span>

    //         <Span columns={2} last><Errors /></Span>
    //       </Breakpoint>

    //       <Breakpoint minWidth={1200} maxWidth={1600}>
    //         <Span columns={6}><Timeline /></Span>

    //         <Span columns={6} last><ChannelsPie /></Span>

    //         <Span columns={3}><Errors /></Span>
    //       </Breakpoint>

    //       <Breakpoint maxWidth={1200} widthMethod="componentWidth">
    //         <Span columns={12}><Timeline /></Span>

    //         <Span columns={12}><ChannelsPie /></Span>

    //         <Span columns={6}><Errors /></Span>
    //       </Breakpoint>
    //     </Grid>
    //   </div>
    // );
  }
}
