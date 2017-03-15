Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const plugins_1 = require("../components/generic/plugins");
const Dialogs_1 = require("../components/generic/Dialogs");
var { Dialog } = Dialogs_1.default;
class Elements {
    static loadLayoutFromDashboard(dashboard) {
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
        return layouts;
    }
    static loadElementsFromDashboard(dashboard, layout) {
        var elements = [];
        var _layout = layout;
        dashboard.elements.forEach((element, idx) => {
            var ReactElement = plugins_1.default[element.type];
            var { id, dependencies, actions, props, title, subtitle, size } = element;
            var layoutProps = _.find(_layout, { "i": id });
            elements.push(<div key={id}>
          <ReactElement key={idx} dependencies={dependencies} actions={actions || {}} props={props || {}} title={title} subtitle={subtitle} layout={layoutProps}/>
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
    static loadDialogsFromDashboard(dashboard) {
        if (!dashboard.dialogs) {
            return null;
        }
        var dialogs = dashboard.dialogs.map((dialog, idx) => <Dialog key={idx} id={dialog.id}/>);
        return dialogs;
    }
}
exports.default = Elements;
