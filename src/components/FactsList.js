import React from 'react';
import Fluxxor from 'fluxxor';
import { SERVICES } from '../services/services';
import ReactListView from 'react-list-view';
import { Link } from 'react-router';
import { routes } from '../routes/routes';
import { getHumanDate } from '../utils/Utils.js';

const FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin("FactsStore");

export const FactsList = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  displayName: 'FactsList',

  // Default card sizes
  minCardWidth: 320,
  maxCardHeight: 140,
  defaultColumnGutter: 20,

  // Calculated properties
  columns: 1,
  rows: 0,
  cardWidth: 0,
  cardHeight: 0,
  gutter: 0,
  excludedHeight: 0,

  // Infinite scroll vars
  isReady: true,
  scrollThreshold: 0.2,
  scrollTop: 0,

  // Page element CSS selectors used to calculate the remaining height available for infinite scrolling list view  
  excludedElements: [".navbar"],

  _loadFacts: function () {
    // Wait until page has rendered before trying to load next batch
    if (this.isReady) {
      this.ready = false;
      this.getFlux().actions.FACTS.load_facts(this.state.pageSize, this.state.skip);
    }
  },

  getInitialState: function () {
  },

  getStateFromFlux: function () {
    return this.getFlux().store("FactsStore").getState();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },

  componentWillMount: function() {
    // Set properties required for redraw of List View on return
    this.excludedHeight = this.state.pageState.excludedHeight;
    if ( this.state.facts.length > 0 ) {
      this._calcRowsAndColumns();
      return;
    }
    this._loadFacts();
  },

  componentDidMount() {
    // The columns will need to be recalculated when page size changes
    window.addEventListener("resize", this._handleResize);
    var scrollView = document.querySelector("#facts");
    if (scrollView && this.state.pageState.scrollTop > this.defaultColumnGutter) {
      // Restores last scroll position of React List View 
      scrollView.firstChild.scrollTop = this.state.pageState.scrollTop;
    }
  },

  componentWillUnmount() {
    this.getFlux().actions.FACTS.save_page_state({
      scrollTop : this.scrollTop,
      excludedHeight : this.excludedHeight
    });
    window.removeEventListener("resize", this._handleResize);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    this._calcExcludedHeight();
    this._calcRowsAndColumns();
    return true;
  },

  render() {
    if (!this.state.facts.length > 0) {
      return (<div className="loadingPage"><p>Loading facts&hellip;</p></div>);
    }
    let cssHeight = 'calc(100vh - ' + this.excludedHeight + 'px)';
    return (
      <div id="facts" style={{ height: cssHeight }} onScroll={this._handleScroll}>
        <ReactListView style={{ height: cssHeight }}
          rowHeight={this._rowHeight()}
          rowCount={this.rows}
          renderItem={this._renderItem}
          columnCount={this.columns}
          columnWidth={this._columnWidth()}
          />
      </div>
    );
  },

  componentDidUpdate: function() {
    this.ready = true;
  },

  _renderItem(x, y, style) {
    let item = this._getItem(x, y);

    // Update cell style properties
    style.height = this.cardHeight + 'px';
    if (this.columns > 1) {
      style.width = this.cardWidth + 'px';
      style.marginLeft = this.gutter + 'px';
    } else {
      style.width = '100%';
      style.marginLeft = '0px';
    }

    // No item available at grid position
    if (item.id === -1) {
      return;
    }

    let dateString = getHumanDate(item.id);
    return (
      <div className="cell" style={style}>
        <div className="card">
          <p className="date">{dateString}</p>
          <h3 className="title truncate-2"><Link to={`/site/${this.props.siteKey}/facts/${item.id}`}>{item.title}</Link></h3>
          <ul className="tags">
            {item.tags.map(function (tag) {
              return <li key={tag}>{tag}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  },

  _columnWidth() {
    // No gutter required for single column (maximize design on compact width displays)
    return (this.columns > 1) ? this.cardWidth + this.gutter * 2 : this.cardWidth;
  },

  _rowHeight() {
    return this.cardHeight + this.gutter;
  },

  _calcRowsAndColumns() {
    let availableWidth = Math.min(document.documentElement.clientWidth, window.innerWidth);
    let minColumnWidth = this.minCardWidth + this.defaultColumnGutter * 2;
    let maxColumns = Math.floor(availableWidth / minColumnWidth);
    this.cardHeight = this.maxCardHeight;
    let count = this._totalItems();

    // Single column layout (compact width)
    if (maxColumns <= 1 || minColumnWidth > availableWidth) {
      this.columns = 1;
      this.rows = count;
      this.gutter = 0;
      this.cardWidth = availableWidth;
      return;
    }

    // Adjust no. of columns depending on screen width
    this.columns = maxColumns;
    this.rows = Math.ceil(count / this.columns);
    this.gutter = this.defaultColumnGutter;
    this.cardWidth = Math.floor((availableWidth - this.gutter * 2 * this.columns) / this.columns);
    return;
  },

  _totalItems() {
    let l = this.state.facts.length;
    var count = 0;
    for (var i = 0; i < l; i++) {
      count += this.state.facts[i].facts.length;
    }
    return count;
  },

  _sections() {
    return this.state.facts.length;
  },

  _getItem(x, y) {
    let index = this._getIndex(x, y);
    return this._getItemAtIndex(index);
  },

  _getItemAtIndex(index) {
    let l = this.state.facts.length;
    var count = 0,
      sectionIndex = 0,
      sectionTotal = 0;
    // Get item in sections
    for (var i = 0; i < l; i++) {
      sectionIndex = index - count;
      sectionTotal = this.state.facts[i].facts.length;
      if (sectionIndex < sectionTotal) {
        return this.state.facts[i].facts[sectionIndex];
      }
      count += sectionTotal;
    }
    return { "id": -1, "title": "" }; // No record available at index
  },

  _getIndex(x, y) {
    return this.columns * y + x;
  },

  _handleScroll(e) {
    let y = e.target.scrollTop;
    if (y !== 0) {
      this.scrollTop = y;
    }
    let scrollViewHeight = e.target.offsetHeight;
    let contentHeight = e.target.firstChild.offsetHeight;
    let h = contentHeight - scrollViewHeight;
    let scrollingBuffer = h * this.scrollThreshold;
    if (h - y < scrollingBuffer) {
      // Infinite scroll
      this._loadFacts();
    }
  },

  _handleResize(e) {
    this.setState({ width: document.body.clientWidth, height: document.body.clientHeight });
  },

  // NB: Infinite scroll with the React List View component only works with scroll view container using an absolute pixel height so the vertical space available needs to be calculated using DOM element selectors.
  _calcExcludedHeight() {
    var height = 0;
    var i = this.excludedElements.length;
    while (i--) {
      height += document.querySelector(this.excludedElements[i]).offsetHeight;
    }
    this.excludedHeight = height;
  }

});

