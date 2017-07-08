import * as React from 'react';
import alt, { AbstractStoreModel } from '../../../alt';

import { DataSourceConnector, IDataSourceDictionary } from '../../../data-sources/DataSourceConnector';

import settingsActions from './SettingsActions';

import { downloadBlob } from '../../Dashboard/DownloadFile'; 

export interface IExportData {
  id: string;
  data: any;
  isJSON: boolean;
  query: string;
  group: string;
  isGroupedJSON: boolean;
}

interface ISettingsStoreState {
  visible: boolean;
  title: string;
  elementId: string;
  dashboard?: IDashboardConfig;
  selectedIndex: number;
  exportData?: IExportData[];
  result?: string;
}

class SettingsStore extends AbstractStoreModel<ISettingsStoreState> implements ISettingsStoreState {

  visible: boolean;
  title: string;
  elementId: string;
  dashboard?: IDashboardConfig;
  selectedIndex: number;
  exportData?: IExportData[];
  result?: string;

  constructor() {
    super();

    this.visible = false;
    this.selectedIndex = 0;

    this.bindListeners({
      openDialog: settingsActions.openDialog,
      closeDialog: settingsActions.closeDialog,
      selectIndex: settingsActions.selectIndex,
      getExportData: settingsActions.getExportData,
      downloadData: settingsActions.downloadData,
    });
  }

  openDialog(state: IDict<string>) {
    this.title = state.title;
    this.elementId = state.elementId;
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  selectIndex(index: number) {
    this.selectedIndex = index;
  }

  downloadData() {
    const selected = this.exportData[this.selectedIndex];
    if (!selected) {
      return;
    }
    const text = selected.isJSON ? JSON.stringify(selected.data) : selected.data.toString();
    const filename = selected.id + '.json';
    downloadBlob(text, 'application/json', filename);
  }

  getExportData(dashboard: IDashboardConfig) {
    if (!this.elementId) {
      console.warn('Requires element "id" prop:', this.elementId);
      return;
    }

    const matches = this.elementId.match(/[0-9]*$/g);
    if (!matches) {
      console.warn('Element index not found:', this.elementId);
      return;
    }
    const elementIndex = parseInt(matches[0], 10);
    if (isNaN(elementIndex) || elementIndex >= dashboard.elements.length || elementIndex < 0) {
      console.warn('Element index invalid value:', elementIndex);
      return;
    }

    const element: IElement = dashboard.elements[elementIndex];
    this.exportData = this.extrapolateExportData(element.dependencies);
    this.selectedIndex = 0; // Reset selection
  }

  private extrapolateExportData(dependencies: IStringDictionary): IExportData[] {
    let result: IExportData[] = [];
    const datasources = DataSourceConnector.getDataSources();

    Object.keys(dependencies).forEach((id) => {
      const dependency = dependencies[id];

      const dependencyPath = dependency.split(':');
      if (dependencyPath.length !== 2) {
        return;
      }

      const dependencySource = dependencyPath[0];
      const dependencyProperty = dependencyPath[1];

      const datasource = Object.keys(datasources).find(key => dependencySource === key);
      if (!datasource) {
        return;
      }

      if (datasource === 'mode' || datasource === 'modes') {
        return;
      }

      // Data (JSON)
      let data: any;
      let isJSON = false;
      let isGroupedJSON = false;
      let group = datasource;
      const values = datasources[datasource].store.state[dependencyProperty];
      if (values === null || typeof values === undefined) {
        console.warn('Missing data:', datasource, dependency);
        return;
      }
      if (typeof values === 'object' || Array.isArray(values)) {
        isJSON = true;
      }
      data = values;

      // Query
      let queryFn, queryFilters;
      let queryId = dependencyProperty;
      const forkedQueryComponents = dependencyProperty.split('-');
      const params = datasources[datasource].config.params;

      const isForked = !params.query && !!params.table;

      if (!isForked) {
        // Unforked
        queryFn = params.query;
      } else {
        // Forked
        if (forkedQueryComponents.length === 2) {
          queryId = forkedQueryComponents[0];
          group = queryId;
        }
        if (!params.queries[queryId]) {
          console.warn(`Unable to locate query id '${queryId}' in datasource '${dependencySource}'.`);
          return;
        }
        queryFn = params.queries[queryId].query;
        queryFilters = params.queries[queryId].filters;
      }

      // Query dependencies
      let query, filter = '';
      let queryDependencies: IDict<any> = {};
      let timespan = '60d';
      if (typeof queryFn === 'function') {
        // Get query function dependencies
        const queryDependenciesDict = datasources[datasource].config.dependencies || {};

        Object.keys(queryDependenciesDict).forEach((dependenciesKey) => {
          const value = queryDependenciesDict[dependenciesKey];
          const path = value.split(':');

          let source = value;
          let property;

          if (path.length === 2) {
            source = path[0];
            property = path[1];
          }

          if (source.startsWith('::')) {
            return;
          }

          const datasourceId = Object.keys(datasources).find(key => source === key);
          if (!datasourceId) {
            console.warn('Unable to find data source id', source);
            return;
          }
          const resolvedValues = !property ? JSON.parse(JSON.stringify(datasources[datasourceId].store.state)) 
            : datasources[datasourceId].store.state[property];
          let merge = {};
          merge[dependenciesKey] = resolvedValues;
          Object.assign(queryDependencies, merge);
        });

        query = queryFn(queryDependencies);
      } else {
        query = queryFn ? queryFn.toString() : 'n/a';
      }

      query = this.formatQueryString(query);

      // Application Insights
      if (datasources[datasource].config.type === 'ApplicationInsights/Query') {
        const table = datasources[datasource].config.params.table || null;
        if (queryDependencies['timespan'] && queryDependencies['timespan']['queryTimespan']) {
          timespan = queryDependencies['timespan']['queryTimespan'];
          timespan = this.convertApplicationInsightsTimespan(timespan);
        }
        filter = this.formatApplicationInsightsFilterString(queryFilters, queryDependencies);
        query = this.formatApplicationInsightsQueryString(query, timespan, filter, table);
      }

      const exportData: IExportData = { id, data, isJSON, query, group, isGroupedJSON };
      result.push(exportData);
    });

    // Group primative results
    result = result.reduce((a: IExportData[], c: IExportData) => {
      if (c.isJSON) {
        a.push(c);
        return a;
      }
      const target = a.find((i) => i.group === c.group);
      let data = {};
      data[c.id] = c.data;
      // new
      if (!target) {
        c.data = data;
        c.isGroupedJSON = true;
        c.isJSON = true;
        c.id = c.group;
        a.push(c);
        return a;
      }
      // skip
      if (target.isGroupedJSON !== true) {
        a.push(c);
        return a;
      }
      // merge
      target.data = Object.assign(target.data, data); 
      return a;
    },                     []);

    // Order by largest data set
    result.sort((a, b) => b.data.toString().length - a.data.toString().length);
    return result;
  }

  private formatQueryString(query: string) {
    // Strip indent whitespaces
    return query.replace(/(\s{2,})?(.+)?/gm, '$2\n').trim(); 
  }

  private formatApplicationInsightsQueryString(query: string, timespan: string, filter: string, table?: string) {
    // Move '|' to start of each line
    let str = query.replace(/(\|)((\s??\n\s??)(.+?))/gm, '\n| $4'); 
    str = str.replace(/(and)/gm, '\n  $1'); // force newline on 'and'
    str = str.replace(/([^\(\'\"])(,\s*)(?=(\w+[^\)\'\"]\w+))/gim, '$1,\n  '); // force newline on ','
    const timespanQuery = '| where timestamp > ago(' + timespan + ') \n';
    // Checks for '|' at start
    const matches = str.match(/^(\s*\||\s*\w+\s*\|)/ig); 
    const start = (!matches || matches.length !== 1) ? '| ' : '';
    if (table) {
      str = table + ' \n' + timespanQuery + filter + start + str;
    } else {
      // Insert timespan and filter after table name
      str = str.replace(/^\s*(\w+)\s*/gi, '$1 \n' + timespanQuery + filter + start); 
    }
    return str;
  }

  private formatApplicationInsightsFilterString(filters: IStringDictionary[], dependencies: IDict<any>) {
    let str = '';
    if (!filters) {
      return str;
    }
    // Apply selected filters to connected query
    filters.forEach((filter) => {
      const { dependency, queryProperty } = filter;
      const selectedFilters: string[] = dependencies[dependency] || [];
      if (selectedFilters.length > 0) {
        const f = '| where ' + selectedFilters.map((value) => `${queryProperty}=="${value}"`).join(' or ');
        str = `${str}${f} \n`;
      }
    });
    return str;
  }

  private convertApplicationInsightsTimespan(timespan: string) {
    let str = timespan;
    if (timespan.substr(0, 2) === 'PT') {
      str = str.substring(2).toLowerCase();
    } else if (timespan.substr(0, 1) === 'P') {
      str = str.substring(1).toLowerCase();
    }
    return str;
  }

}

const settingsStore = alt.createStore<ISettingsStoreState>(SettingsStore, 'SettingsStore');

export default settingsStore;
