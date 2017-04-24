import * as React from 'react';
import * as _ from 'lodash';
import plugins from './generic/plugins';

export default class ElementConnector {
  static loadLayoutFromDashboard(elementsContainer: IElementsContainer, dashboard: IDashboardConfig) : ILayouts {
    
    var layouts = {};
    _.each(dashboard.config.layout.cols, (totalColumns, key) => {

      var curCol = 0;
      var curRowOffset = 0;
      var maxRowHeight = 0;

      // Go over all elements in the dashboard and check their size
      elementsContainer.elements.forEach(element => {
        var { id, size } = element;

        if (curCol > 0 && (curCol + size.w) > totalColumns) {
          curCol = 0;
          curRowOffset = maxRowHeight;
        }

        layouts[key] = layouts[key] || [];
        layouts[key].push({
          "i": id,
          "x": curCol,
          "y": curRowOffset,
          "w": size.w,
          "h": size.h
        });

        curCol += size.w;
        maxRowHeight = Math.max(curRowOffset + size.h, maxRowHeight);
      });
    });

    return layouts;
  }

  static loadElementsFromDashboard(dashboard: IElementsContainer, layout: ILayout[]): React.Component<any, any>[] {
    var elements = [];

    dashboard.elements.forEach((element, idx) => {
      var ReactElement = plugins[element.type];
      var { id, dependencies, actions, props, title, subtitle, size, theme } = element;
      var layoutProps = _.find(layout, { "i": id });

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
                theme={theme}
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
              title={element.title}
              subtitle={element.subtitle}
              icon={element.icon}
        />
      )
    });

    return { filters, additionalFilters };
  }
}