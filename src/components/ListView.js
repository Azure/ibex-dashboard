import React from 'react';
import ReactListView from 'react-list-view';

// ListView is a wrapper component for ReactListView with adaptive design and infinite scrolling support
// - Adds responsive resizing to change no. of columns - allows same data to be displayed as list view or grid view.
// - Adds infinite scrolling once scroll threshold is reached
// - Provides work around for the double scrollbar effect when using 100% height by calculating the height of other page elements to subtract.

export default class ListView extends React.Component {
    constructor(props) {
        super(props);

        // internal calculated properties
        this._cardWidth = this.props.minCardWidth;
        this._cardHeight = this.props.maxCardHeight;
        this._gutter = this.props.gutter;
        this._columns = 1;
        this._rows = 0;
        this._totalItems = this.props.items.length;
        this._subtractedHeight = 0;
        this._ready = true;
    }

    componentWillReceiveProps(nextProps) {
        this._totalItems = nextProps.items.length; // update total item count for list view component
        this.renderRowsAndColumns();
    }

    componentDidMount() {
        if (this.props.items.length > 0) {
            this.renderRowsAndColumns();
        }
        // The columns will need to be recalculated when page size changes
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    render() {
        let cssHeight = (this._subtractedHeight > 0) ? 'calc(100vh - ' + this._subtractedHeight + 'px)' : '100vh';
        return (
            <div style={{ height: cssHeight }} onScroll={this.handleScroll}>
                <ReactListView style={{ height: cssHeight, overflowX: "hidden" }}
                    columnCount={this._columns}
                    rowCount={this._rows}
                    columnWidth={this.columnWidth()}
                    rowHeight={this.rowHeight()}
                    renderItem={this.renderItem}
                    />
            </div>
        );
    }

    componentDidUpdate() {
        this._ready = true;
    }

    columnWidth = () => {
        // No gutter required for single column (maximize design on compact width displays)
        return (this._columns > 1) ? this._cardWidth + this._gutter * 2 : this._cardWidth;
    }

    rowHeight = () => {
        return this._cardHeight + this._gutter;
    }

    getIndex = (x, y) => {
        return this._columns * y + x;
    }

    getItem = (x, y) => {
        let index = this.getIndex(x, y);
        return this.getItemAtIndex(index);
    }

    getItemAtIndex = (index) => {
        if (index < this.getTotalItems()) {
            return this.props.items[index];
        }
        return null; // No record available at index
    }

    getTotalItems() {
        return this._totalItems;
    }

    renderItem = (x, y, style) => {
        const item = this.getItem(x, y);
        // No item available at grid position
        if (!item) {
            return;
        }
        // Update cell style properties
        style.height = this._cardHeight + 'px';
        if (this._columns > 1) {
            style.width = this._cardWidth + 'px';
            style.marginLeft = this._gutter + 'px';
        } else {
            style.width = '100%';
            style.marginLeft = '0px';
        }
        // Call item render function
        return this.props.renderCardItem.call(this, item, style);
    }

    renderRowsAndColumns() {
        this.calcSubtractedHeight();
        const availableWidth = Math.min(document.documentElement.clientWidth, window.innerWidth);
        const minColumnWidth = this.props.minCardWidth + this.props.gutter * 2;
        const maxColumns = Math.floor(availableWidth / minColumnWidth);
        const count = this.getTotalItems();
        this._cardHeight = this.props.maxCardHeight;

        // List view: single column layout (compact width)
        if (maxColumns <= 1 || minColumnWidth > availableWidth) {
            this._columns = 1;
            this._rows = count;
            this._gutter = 0;
            this._cardWidth = availableWidth;
            this.forceUpdate();
            return;
        }

        // Grid view: no. of columns increases with screen width
        this._columns = maxColumns;
        this._rows = Math.ceil(count / this._columns);
        this._gutter = this.props.gutter;
        this._cardWidth = Math.floor((availableWidth - this._gutter * 2 * this._columns) / this._columns);
        this.forceUpdate();
    }

    // NB: Infinite scroll with the React List View component only works with scroll view container using an absolute pixel height so the vertical space available needs to be calculated using DOM element selectors.
    calcSubtractedHeight() {
        let height = 0;
        let i = this.props.subtractedElements.length;
        while (i--) {
            height += document.querySelector(this.props.subtractedElements[i]).offsetHeight;
        }
        return this._subtractedHeight = height;
    }

    handleResize = (e) => {
        this.renderRowsAndColumns();
    }

    handleScroll = (e) => {
        // return early if load items function is undefined
        if (this.props.loadItems === null) {
            return;
        }
        // wait until page is rendered with loaded items before loading more
        if (!this._ready) {
            return;
        }
        // Infinite scroll
        const y = e.target.scrollTop;
        const scrollViewHeight = e.target.offsetHeight;
        const contentHeight = e.target.firstChild.offsetHeight;
        const h = contentHeight - scrollViewHeight;
        const scrollingBuffer = h * this.props.scrollThreshold;
        if (h - y < scrollingBuffer) {
            // Load more items when ready...
            this._ready = false;
            this.props.loadItems();

        }
    }

    updateScrollTop(scrollPosition) {
        const scrollView = document.querySelector(".ReactListView");
        if (scrollView) {
            scrollView.scrollTop = scrollPosition;
        }
    }

};

ListView.defaultProps = {
    items: [],
    renderCardItem: null,
    // Default card sizes
    minCardWidth: 280,
    maxCardHeight: 140,
    gutter: 20,
    // Infinite scroll
    loadItems: null,
    scrollThreshold: 0.2,
    subtractedElements: []
};

ListView.propTypes = {
    items: React.PropTypes.array.isRequired,
    renderCardItem: React.PropTypes.func.isRequired,

    minCardWidth: React.PropTypes.number,
    maxCardHeight: React.PropTypes.number,
    gutter: React.PropTypes.number,

    loadItems: React.PropTypes.func,
    scrollThreshold: React.PropTypes.number,
    subtractedElements: React.PropTypes.array
};
