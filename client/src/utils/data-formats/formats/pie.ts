import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Formats a result to suite a pie chart
 * 
 * Receives a list of filtering values:
 * values: [
 *  { count: 10, field: 'piece 1' },
 *  { count: 15, field: 'piece 2' },
 *  { count: 44, field: 'piece 3' },
 * ]
 * 
 * And outputs the result in a consumable filter way:
 * result: {
 *  "prefix-pieData": [ 
 *    { name: 'bar 1', value: 10},
 *    { name: 'bar 2', value: 15},
 *    { name: 'bar 3', value: 20},
 *  ],
 * }
 * 
 * "prefix-selected" will be able to hold the selected values from the filter component
 * 
 * @param format { 
 *  type: 'pie',
 *  args: {
 *    value: string - The field name holding the value the pie piece
 *    data: string - the state property holding the data (default is 'values').
 *    label: string - The field name holding the series name (aggregation in a specific field)
 *    maxLength: number - At what length to cut string values (default: 13),
 *  }
 * }
 * @param state Current received state from data source
 * @param plugin The entire plugin (for id generation, params etc...)
 * @param prevState The previous state to compare for changing filters
 */
export function pie(
  format: string | IDataFormat,
  state: any,
  plugin: IDataSourcePlugin,
  prevState: any) {

  if (typeof format === 'string') {
    return formatWarn('format should be an object with args', 'timeline', plugin);
  }

  const args = format.args || {};
  let values: any[] = state[args.data || 'values'] || [];
  const prefix = getPrefix(format);

  const labelField = args.label || 'name';
  const valueField = args.value || 'value';
  let maxLength = args.maxLength && parseInt(args.maxLength, 10) || 13;
  let maxLengthCut = Math.max(0, maxLength - 3);

  let result = {};
  result[prefix + 'pieData'] = values.map(value => ({
    name: maxLength && value[labelField].length > maxLength
      ? value[labelField].substr(0, maxLengthCut) + '...'
      : value[labelField],
    value: value[valueField]
  }));

  return result;
}