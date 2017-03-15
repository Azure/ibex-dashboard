import * as React from 'react';
import * as _ from 'lodash';
import plugins from '../components/generic/plugins';
import Dialogs from '../components/generic/Dialogs';

var { Dialog } = Dialogs;

export default class Elements {
  static loadLayoutFromDashboard(dashboard: IDashboardConfig) : ILayouts {
    
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

  static loadElementsFromDashboard(dashboard: IDashboardConfig, layout: ILayout): React.Component<any, any>[] {
    var elements = [];
    var _layout : any = layout;

    dashboard.elements.forEach((element, idx) => {
      var ReactElement = plugins[element.type];
      var { id, dependencies, actions, props, title, subtitle, size } = element;
      var layoutProps = _.find(_layout, { "i": id });

      elements.push(
        <div key={id}>
          <ReactElement 
                key={idx} 
                dependencies={dependencies}
                actions={actions || {}}
                props={props || {}}
                title={title}
                subtitle={subtitle}
                layout={layoutProps}
          />
        </div>
      )
    });

    return elements;
  }

  static loadFiltersFromDashboard(dashboard: IDashboardConfig): {
    filters : React.Component<any, any>[],
    additionalFilters: React.Component<any, any>[]
  } {
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

    return { filters, additionalFilters };
  }

  static loadDialogsFromDashboard(dashboard: IDashboardConfig): JSX.Element[] {

    if (!dashboard.dialogs) {
      return null;
    }

    var dialogs = dashboard.dialogs.map((dialog, idx) => 
      <Dialog key={idx} id={dialog.id} />
    );

    return dialogs
  }
}