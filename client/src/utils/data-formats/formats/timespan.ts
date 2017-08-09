import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Receives a timespan data source and formats is accordingly
 * 
 * Receives a list of filtering values (on the data source params variable):
 * params: {
 *  values: ["24 hours","1 week","1 month","3 months"]
 *  selectedValue: "1 month",
 *  queryTimespan: "PT24H",
 *  granularity: "5m"
 * }
 * 
 * And outputs the result in a consumable filter way:
 * result: {
 *  "prefix-values": ["24 hours","1 week","1 month","3 months"]
 *  "prefix-selected": "1 month",
 * }
 * 
 * "prefix-selected" will be able to hold the selected values from the filter component
 * 
 * @param format 'timespan' | { 
 *  type: 'timespan',
 *  args: { 
 *    prefix: string - a prefix string for the exported variables (default to id).
 *  }
 * }
 * @param state Current received state from data source
 * @param dependencies Dependencies for the plugin
 * @param plugin The entire plugin (for id generation, params etc...)
 * @param prevState The previous state to compare for changing filters
 */
export function timespan(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  if (!state) { return null; }

  const params = plugin.getParams();
  const prefix = getPrefix(format);
  let queryTimespan =
    state.selectedValue === '24 hours' ? 'PT24H' :
    state.selectedValue === '1 week' ? 'P7D' :
    state.selectedValue === '1 month' ? 'P30D' :
    'P90D';

  let granularity =
    state.selectedValue === '24 hours' ? '5m' :
    state.selectedValue === '1 week' ? '1d' : '1d';

  let result = { 
    queryTimespan, 
    granularity 
  };
  result[prefix + 'values-all'] = params.values;
  result[prefix + 'values-selected'] = state.selectedValue;

  return result;
}