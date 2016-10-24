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

  // default card sizes
  minCardWidth: 320,
  maxCardHeight: 120,
  defaultColumnGutter: 20,

  // calculated properties
  columns: 1,
  rows: 0,
  cardWidth: 0,
  cardHeight: 0,
  gutter: 0,

  // pagination properties for infinite scrolling
  pageSize: 50,
  skip: 0,
  isLoading: false,

  // page element CSS selectors used to calculate the remaining height available for infinite scrolling list view  
  excludedElements: [".navbar"],

  _loadFacts: function () {
    if (!this.isLoading) {
      this.isLoading = true;
      this.getFlux().actions.FACTS.load_facts(this.pageSize, this.skip);
      this.skip += this.pageSize;
    }
  },

  getInitialState: function () {
    this._loadFacts();
  },

  getStateFromFlux: function () {
    this.isLoading = false;
    return this.getFlux().store("FactsStore").getState();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },

  render() {
    if (!this.state.facts.length > 0) {
      return (<div className="loadingPage"><p>Loading facts&hellip;</p></div>);
    }
    this._calcRowsAndColumns();
    var cssHeight = 'calc(100vh - ' + this._excludedHeight() + 'px)';
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

  _renderItem(x, y, style) {
    var item = this._getItem(x, y);

    // error, no item 
    if (item.id == -1) {
      return (<div><code>Error, item not found.</code></div>);
    }

    // update cell style properties
    style.height = this.cardHeight + 'px';
    if (this.columns > 1) {
      style.width = this.cardWidth + 'px';
      style.marginLeft = this.gutter + 'px';
    } else {
      style.width = '100%';
      style.marginLeft = '0px';
    }

    var dateString = getHumanDate(item.id);
    return (
      <div className="cell" style={style}>
        <div className="card">
          <p className="date">{dateString}</p>
          <h3 className="title truncate-2"><Link to={`/site/${this.props.siteKey}/facts/${item.id}`}>{item.title}</Link></h3>
        </div>
      </div>
    );
  },

  _columnWidth() {
    return (this.columns > 1) ? this.cardWidth + this.gutter * 2 : this.cardWidth; // no gutter required for single column (maximize design on compact width displays)
  },
  _rowHeight() {
    return this.cardHeight + this.gutter;
  },

  _calcRowsAndColumns() {
    var availableWidth = Math.min(document.documentElement.clientWidth, window.innerWidth);
    var minColumnWidth = this.minCardWidth + this.defaultColumnGutter * 2;
    var maxColumns = Math.floor(availableWidth / minColumnWidth);
    this.cardHeight = this.maxCardHeight;
    var count = this._totalItems();

    // single column layout (compact width)
    if (maxColumns <= 1 || minColumnWidth > availableWidth) {
      this.columns = 1;
      this.rows = count;
      this.gutter = 0;
      this.cardWidth = availableWidth;
      return;
    }

    // adjust no. of columns depending on screen width
    this.columns = maxColumns;
    this.rows = Math.ceil(count / this.columns);
    this.gutter = this.defaultColumnGutter;
    this.cardWidth = Math.floor((availableWidth - this.gutter * 2 * this.columns) / this.columns);
    return;
  },

  _totalItems() {
    var l = this.state.facts.length;
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
    var index = this._getIndex(x, y);
    return this._getItemAtIndex(index);
  },

  _getItemAtIndex(index) {
    var l = this.state.facts.length;
    var count = 0,
      sectionIndex = 0,
      sectionTotal = 0;
    // get item in sections
    for (var i = 0; i < l; i++) {
      sectionIndex = index - count;
      sectionTotal = this.state.facts[i].facts.length;
      if (sectionIndex < sectionTotal) {
        return this.state.facts[i].facts[sectionIndex];
      }
      count += sectionTotal;
    }
    console.warn("Error getting item at index:", index, sectionIndex, '/', sectionTotal);
    return { "id": -1, "title": "" }; // error, no record available at index
  },

  _getIndex(x, y) {
    return this.columns * y + x;
  },

  _handleScroll(e) {
    var y = e.target.scrollTop;
    var scrollViewHeight = e.target.offsetHeight;
    var contentHeight = e.target.firstChild.offsetHeight;
    var h = contentHeight - scrollViewHeight;
    var scrollingBuffer = h * 0.2;
    if (h - y < scrollingBuffer) {
      // infinite scroll
      this._loadFacts();
    }
  },

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  handleResize(e) {
    this.setState({ width: document.body.clientWidth, height: document.body.clientHeight });
  },

  // NB: infinite scroll with this list view component only works with scroll view container using an absolute pixel height so we have to calculate the vertical space available.
  _excludedHeight() {
    var height = 0;
    var i = this.excludedElements.length;
    while (i--) {
      height += document.querySelector(this.excludedElements[i]).offsetHeight;
    }
    return height;
  }

});

