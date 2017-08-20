import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Applies selected filters to sample JSON data 
 * Returns filtered data using a prefix. 
 * 
 * @param format { 
 *  type: 'filtered_samples',
 *  args: {
 *    prefix: string - a prefix string for the filtered sample data (defaults to 'filtered').
 *    data: string - the state property holding the data (default is 'values').
 *  }
 * }
 * @param state Current received state from data source
 * @param dependencies Dependencies for the plugin
 * @param plugin The entire plugin (for id generation, params etc...)
 * @param prevState The previous state to compare for changing filters
 */
export function filtered_samples (
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {
  let result = {};

  const args = typeof format !== 'string' && format.args || {};
  const prefix = args['prefix'] || 'filtered';

  const params = plugin.getParams();
  const filters = params.filters;

  // Check for active filters selected
  const hasSelectedFilters = filters.some(filter => (
    dependencies[filter.dependency] && dependencies[filter.dependency].length > 0)
  );
  
  // Apply filter to sample data
  Object.keys(dependencies).forEach(key => {
    // Skip filters
    if (filters.find(f => f.dependency === key)) {
      return;
    }

    // Apply filter data
    const values = dependencies[key];
    let filteredData = {};

    // Return early if no active filters
    if (!hasSelectedFilters) {
      filteredData[prefix + '_' + key] = values;
      Object.assign(result, filteredData);
      return;
    }

    // Get active selected filters
    const activeFilters = filters.reduce((acc, filter) => {
      if (dependencies[filter.dependency].length > 0) {
        acc.push(filter);
      }
      return acc;
    },                                   []);
    
    // Apply active selected filters to sample data
    const filteredValues = values.filter(value => {
      return activeFilters.every(filter => {
        const queryProperty = filter.queryProperty;
        const selectedFilters = dependencies[filter.dependency];
        return value[queryProperty] === selectedFilters.find(selectedFilter => selectedFilter === value[queryProperty]);
      });
    });

    filteredData[prefix + '_' + key] = filteredValues;
    Object.assign(result, filteredData);
  });
  
  return result;
}