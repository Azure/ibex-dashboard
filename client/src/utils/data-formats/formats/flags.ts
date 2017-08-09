import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Turns a list of values into a list of flags
 * 
 * Receives a list of filtering values (on the data source params variable):
 * params: {
 *  values: [ 'value1', 'value2', 'value3' ]
 * }
 * 
 * And outputs the result in a consumable filter way:
 * result: {
 *  "value1": false, (will be true if prefix-selected contains "value1")
 *  "value2": false,
 *  "value3": false,
 *  "prefix-filters": [ 'value 1', 'value 2', 'value 3' ],
 *  "prefix-selected": [ ],
 * }
 * 
 * "prefix-selected" will be able to hold the selected values from the filter component
 * 
 * @param format 'filter' | { 
 *  type: 'filter',
 *  args: { 
 *    prefix: string - a prefix string for the exported variables (default to id).
 *  }
 * }
 * @param state Current received state from data source
 * @param dependencies Dependencies for the plugin
 * @param plugin The entire plugin (for id generation, params etc...)
 * @param prevState The previous state to compare for changing filters
 */
export function flags(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  const prefix = getPrefix(format);
  const params = plugin.getParams();
  if (!params || !Array.isArray(params.values)) {
    return formatWarn('A paramerter "values" is expected as an array on "params" in the data source', 'filter', plugin);
  }

  if (!state) { return null; }

  let flags = {};
  params.values.forEach(key => { flags[key] = state.selectedValue === key; });

  flags[prefix + 'values-all'] = params.values;
  flags[prefix + 'values-selected'] = state.selectedValue;

  return flags;
}