Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const plugins_1 = require("./generic/plugins");
class ElementConnector {
    static loadLayoutFromDashboard(elementsContainer, dashboard) {
        var layouts = {};
        _.each(dashboard.config.layout.cols, (totalColumns, key) => {
            var curCol = 0;
            var curRowOffset = 0;
            var maxRowHeight = 0;
            // Go over all elements in the dashboard and check their size
            elementsContainer.elements.forEach(element => {
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
        return layouts;
    }
    static loadElementsFromDashboard(dashboard, layout) {
        var elements = [];
        dashboard.elements.forEach((element, idx) => {
            var ReactElement = plugins_1.default[element.type];
            var { id, dependencies, actions, props, title, subtitle, size, theme } = element;
            var layoutProps = _.find(layout, { "i": id });
            elements.push(<div key={id}>
          <ReactElement key={idx} dependencies={dependencies} actions={actions || {}} props={props || {}} title={title} subtitle={subtitle} layout={layoutProps} theme={theme}/>
        </div>);
        });
        return elements;
    }
    static loadFiltersFromDashboard(dashboard) {
        var filters = [];
        var additionalFilters = [];
        dashboard.filters.forEach((element, idx) => {
            var ReactElement = plugins_1.default[element.type];
            (element.first ? filters : additionalFilters).push(<ReactElement key={idx} dependencies={element.dependencies} actions={element.actions}/>);
        });
        return { filters, additionalFilters };
    }
}
exports.default = ElementConnector;
