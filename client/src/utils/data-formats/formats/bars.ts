import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Formats a result to suite a bar chart
 * 
 * Receives a list of filtering values:
 * values: [
 *  { count: 10, barField: 'bar 1', seriesField: 'series1Value' },
 *  { count: 15, barField: 'bar 2', seriesField: 'series1Value' },
 *  { count: 20, barField: 'bar 1', seriesField: 'series2Value' },
 *  { count: 44, barField: 'bar 3', seriesField: 'series2Value' },
 * ]
 * 
 * And outputs the result in a consumable filter way:
 * result: {
 *  "prefix-bars": [ 'bar 1', 'bar 2', 'bar 3' ],
 *  "prefix-values": [
 *    { value: 'bar 1', series1Value: 10, series2Value: 20 },
 *    { value: 'bar 2', series1Value: 15, series2Value: 0 },
 *    { value: 'bar 3', series1Value: 0, series2Value: 44 },
 *  ],
 * }
 * 
 * "prefix-selected" will be able to hold the selected values from the filter component
 * 
 * @param format { 
 *  type: 'bars',
 *  args: {
 *    prefix: string - a prefix string for the exported variables (default to id).
 *    valueField: string - The field name holding the value/y value of the bar
 *    barsField: string - The field name holding the names for the bars
 *    seriesField: string - The field name holding the series name (aggregation in a specific field)
 *    valueMaxLength: number - At what length to cut string values (default: 13),
 *    threshold: number - Under this threshold, the values will be aggregated to others (default: 0 - none)
 *    othersValue: string - Name for the 'Others' field (default: 'Others')
 *  }
 * }
 * @param state Current received state from data source
 * @param dependencies Dependencies for the plugin
 * @param plugin The entire plugin (for id generation, params etc...)
 * @param prevState The previous state to compare for changing filters
 */
export function bars(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  if (typeof format === 'string') { 
    return formatWarn('format should be an object with args', 'bars', plugin);
  }
  
  const args = format.args || {};
  const prefix = getPrefix(format);
  const valueField = args.valueField || 'count';
  const barsField = args.barsField || null;
  const seriesField = args.seriesField || null;
  const valueMaxLength = args.valueMaxLength && parseInt(args.valueMaxLength, 10) || 13;
  const threshold = args.threshold || 0;
  const othersValue = args.othersValue || 'Others';

  let values: any[] = state.values;

  // Concating values with '...'
  if (values && values.length && valueMaxLength && (seriesField || barsField)) {
    const cutLength = Math.max(valueMaxLength - 3, 0);
    values.forEach(val => {
      if (seriesField && val[seriesField] && val[seriesField].length > valueMaxLength) {
        val[seriesField] = val[seriesField].substring(0, cutLength) + '...';
      }
      if (barsField && val[barsField] && val[barsField].length > valueMaxLength) {
        val[barsField] = val[barsField].substring(0, cutLength) + '...';
      }
    });
  }

  let result = {};
  let barValues = {};

  // Setting the field describing the bars
  if (barsField) {

    let series = {};
    values.forEach(val => {
      barValues[val[barsField]] = barValues[val[barsField]] || { value: val[barsField] };

      if (threshold && val[valueField] < threshold) {
        barValues[val[barsField]][othersValue] = (barValues[val[barsField]][othersValue] || 0) + val[valueField];
        series[othersValue] = true;
      } else {
        barValues[val[barsField]][val[seriesField]] = val[valueField];
        series[val[seriesField]] = true;
      }
    });

    result[prefix + 'bars'] = _.keys(series);
    result[prefix + 'values'] = _.values(barValues);

  } else {
    result[prefix + 'bars'] = [ valueField ];
    result[prefix + 'values'] = values;
  }

  return result;
}