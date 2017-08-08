import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Formats a result to fit a filter.
 * 
 * Receives a list of filtering values:
 * values: [
 *  { field: 'value 1' },
 *  { field: 'value 2' },
 *  { field: 'value 3' },
 * ]
 * 
 * And outputs the result in a consumable filter way:
 * result: {
 *  "prefix-filters": [ 'value 1', 'value 2', 'value 3' ],
 *  "prefix-selected": [ ],
 * }
 * 
 * "prefix-selected" will be able to hold the selected values from the filter component
 * 
 * @param format { 
 *  type: 'filter',
 *  args: { 
 *    prefix: string - The prefix of the variable to be consumed, 
 *    field: string - the field holding the filter values in the results
 *  }
 * }
 * @param state Current received state from data source
 * @param dependencies Dependencies for the plugin
 * @param plugin The entire plugin (for id generation, params etc...)
 * @param prevState The previous state to compare for changing filters
 */
export function filter (
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  const { values } = state;

  let filterValues = values;
  if (!filterValues || typeof format === 'string' || !format.args.prefix) { return {}; }

  const { prefix, field } = format.args;
  const unknown = format.args.unknown || 'unknown';

  // This code is meant to fix the following scenario:
  // When "Timespan" filter changes, to "channels-selected" variable
  // is going to be reset into an empty set.
  // For this reason, using previous state to copy filter
  const filters = filterValues.map(x => x[field] || unknown);
  let selectedValues = [];
  if (prevState[prefix + '-selected'] !== undefined) {
    selectedValues = prevState[prefix + '-selected'];
  }

  let result = {};
  result[prefix + '-values'] = filters;
  result[prefix + '-selected'] = selectedValues;

  return result;
}