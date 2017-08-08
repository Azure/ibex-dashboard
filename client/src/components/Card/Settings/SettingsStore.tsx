import * as React from 'react';
import alt, { AbstractStoreModel } from '../../../alt';

import { DataSourceConnector, IDataSourceDictionary, IDataSource } from '../../../data-sources/DataSourceConnector';

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
    this.title = '';
    this.exportData = null;
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

    const matches = this.elementId.split('@');
    if (matches.length !== 2) {
      console.warn('Element index not found:', this.elementId);
      return;
    }

    const id = matches[0];
    const index = parseInt(matches[1], 10);
    let elements = dashboard.elements;

    if (isNaN(index) || index >= elements.length || index < 0) {
      console.warn('Element index invalid value:', index);
      return;
    }

    if (elements[index].id === id) {
      this.getElement(elements, index);
      return;
    }

    // handle dialog element
    dashboard.dialogs.every(dialog => {
        if (dialog.elements.length > index && dialog.elements[index].id === id) {
          elements = dialog.elements;
          this.getElement(elements, index);
          return false;
        } else {
          return true;
        }
      });
  }

  private getElement(elements: IElement[], index: number) {
    const element: IElement = elements[index];
    this.exportData = this.extrapolateElementExportData(element.dependencies, element.source, element.id);
    this.selectedIndex = 0; // resets dialog menu selection
  }

  private extrapolateElementExportData(elementDependencies: IStringDictionary, 
                                       sources: string | IStringDictionary, 
                                       elementId: string): IExportData[] {
    let result: IExportData[] = [];
    let dependencies = {};
    Object.assign(dependencies, elementDependencies);
    if (typeof sources === 'string') {
      let source = {};
      source[elementId] = sources;
      Object.assign(dependencies, source);
    } else if (sources && typeof sources === 'object' && Object.keys(sources).length > 0 ) {
      Object.assign(dependencies, sources);
    }
    if (!dependencies || Object.keys(dependencies).length === 0 ) {
      console.warn('Missing element dependencies');
      return result;
    }
    const datasources = DataSourceConnector.getDataSources();
    Object.keys(dependencies).forEach((id) => {
      const dependency = dependencies[id];

      let dependencySource = dependency;
      let dependencyProperty = 'values';
      const dependencyPath = dependency.split(':');

      if (dependencyPath.length === 2) {
        dependencySource = dependencyPath[0];
        dependencyProperty = dependencyPath[1];
      }
      
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
        // unforked
        queryFn = params.query;
      } else {
        // forked
        if (!params.queries[queryId] && forkedQueryComponents.length === 2) {
          queryId = forkedQueryComponents[0];
          group = queryId;
        }
        if (params.queries[dependencySource]) {
          queryId = dependencySource; // dialog case
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

          if (source.startsWith('::') || source === 'connection') {
            return;
          }

          if (source === 'args') {
            const args = datasources[datasource].plugin['lastArgs'];
            const arg = Object.keys(args).find(key => property === key);
            if (!arg) {
              console.warn('Unable to find arg property:', property);
              return;
            }
            const argValue = args[arg] || '';
            let append = {};
            append[property] = argValue;
            Object.assign(queryDependencies, append);
          } else {
            const datasourceId = Object.keys(datasources).find(key => source === key);
            if (!datasourceId) {
              console.warn('Unable to find data source id:', source);
              return;
            }
            const resolvedValues = !property ? JSON.parse(JSON.stringify(datasources[datasourceId].store.state)) 
              : datasources[datasourceId].store.state[property];
            let append = {};
            append[dependenciesKey] = resolvedValues;
            Object.assign(queryDependencies, append);
          }
        });
        query = queryFn(queryDependencies);
      } else {
        query = queryFn ? queryFn.toString() : 'n/a';
      }

      query = this.formatQueryString(query);

      const dataSource: IDataSource = datasources[datasource];
      const elementQuery = dataSource.plugin.getElementQuery(dataSource, queryDependencies, query, queryFilters);
      if (elementQuery !== null) {
        query = elementQuery;
      }

      const exportData: IExportData = { id, data, isJSON, query, group, isGroupedJSON };
      result.push(exportData);
    });

    // Group primative (scorecard) results
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

}

const settingsStore = alt.createStore<ISettingsStoreState>(SettingsStore, 'SettingsStore');

export default settingsStore;
