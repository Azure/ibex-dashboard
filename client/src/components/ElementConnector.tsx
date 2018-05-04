import * as React from 'react';
import * as _ from 'lodash';
import plugins from './generic/plugins';
import * as formats from '../utils/data-formats';

import { DataSourceConnector } from '../data-sources/DataSourceConnector';
import VisibilityActions from '../actions/VisibilityActions';
import VisibilityStore from '../stores/VisibilityStore';

export default class ElementConnector {
  static loadLayoutFromDashboard(elementsContainer: IElementsContainer, dashboard: IDashboardConfig): ILayouts {
    
    var layouts = {};
    _.each(dashboard.config.layout.cols, (totalColumns, key) => {

      let layoutIDs = {};
      var curCol = 0;
      var curRowOffset = 0;
      var maxRowHeight = 0;

      // Go over all elements in the dashboard and check their size
      layouts[key] = [];

      elementsContainer.elements.forEach(element => {
        let { id, size, location } = element;

        if (layoutIDs[id]) { return; }
        layoutIDs[id] = true;

        if (curCol > 0 && (curCol + size.w) > totalColumns) {
          curCol = 0;
          curRowOffset = maxRowHeight;
        }

        location = location || { x: -1, y: -1 };
        if (location.x !== 0 && location.x < 0) { location.x = curCol; }
        if (location.y !== 0 && location.y < 0) { location.y = curRowOffset; }

        layouts[key].push({
          'i': id,
          'x': location.x,
          'y': location.y,
          'w': size.w,
          'h': size.h
        });

        curCol += size.w;
        maxRowHeight = Math.max(curRowOffset + size.h, maxRowHeight);
      });
    });

    return layouts;
  }

  static createGenericFilter(
    ReactElement: any, 
    idx?: number, 
    icon?: string,
    source?: string | IStringDictionary,
    dependencies?: IStringDictionary, 
    actions?: IDictionary, 
    title?: string, 
    subtitle?: string): JSX.Element {

    return ElementConnector.createGenericElement(
      ReactElement,
      '__filter',
      idx || 0,
      source, 
      dependencies,
      actions,
      null,
      title, 
      subtitle,
      null, 
      null,
      icon
    );
  }

  static createGenericElement(
    ReactElement: any, 
    id: string, 
    idx?: number, 
    source?: string | IStringDictionary,
    dependencies?: IStringDictionary, 
    actions?: IDictionary, 
    props?: IDictionary, 
    title?: string, 
    subtitle?: string, 
    layout?: ILayout, 
    theme?: string[],
    icon?: string): JSX.Element {

    if (source && typeof ReactElement.fromSource === 'function') {
      let fromSource = ReactElement.fromSource(source);
      dependencies = _.extend({}, dependencies, fromSource);
    }

    return (
      <ReactElement 
        key={idx}
        id={id + '@' + (idx || 0)}
        dependencies={dependencies}
        actions={actions || {}}
        props={props || {}}
        title={title}
        subtitle={subtitle}
        layout={layout}
        theme={theme}
        icon={icon}
      />
    );
  }

  static loadElementsFromDashboard(dashboard: IElementsContainer, layout: ILayout[]): React.Component<any, any>[] {
    var elements = [];
    var elementId = {};
    var visibilityFlags = (VisibilityStore.getState() || {}).flags || {};

    dashboard.elements.forEach((element, idx) => {
      var ReactElement = plugins[element.type];
      var { id, dependencies, source, actions, props, title, subtitle, size, theme, location } = element;
      var layoutProps = _.find(layout, { 'i': id });

      if (dependencies && dependencies.visible && !visibilityFlags[dependencies.visible]) { 
        if (typeof visibilityFlags[dependencies.visible] === 'undefined') {
          let flagDependencies = DataSourceConnector.extrapolateDependencies({ value: dependencies.visible });
          let flag = {};
          flag[dependencies.visible] = flagDependencies.dataSources.value || true;

          (VisibilityActions.setFlags as any).defer(flag);
        } else {
          return; 
        }
      }

      if (elementId[id]) { return; }

      elementId[id] = true;
      elements.push(
        <div key={id}>
          {
            ElementConnector.createGenericElement(
              ReactElement, 
              id, 
              idx, 
              source, 
              dependencies, 
              actions, 
              props, 
              title, 
              subtitle, 
              layoutProps, 
              theme
            )
          }
        </div>
      );
    });

    return elements;
  }

  static loadFiltersFromDashboard(dashboard: IDashboardConfig): {
    filters: React.Component<any, any>[],
    additionalFilters: React.Component<any, any>[]
  } {
    let filters = [];
    let additionalFilters = [];
    dashboard.filters.forEach((element, idx) => {
      let ReactElement = plugins[element.type];
      let { dependencies, source, actions, title, subtitle, icon } = element;

      (element.first ? filters : additionalFilters).push(
        ElementConnector.createGenericFilter(
          ReactElement,
          idx,
          icon,
          source,
          dependencies,
          actions,
          title,
          subtitle
        )
      );
    });

    return { filters, additionalFilters };
  }
}