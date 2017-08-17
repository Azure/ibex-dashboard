import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

/**
 * Formats a result to suite a timeline (time series) chart
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
 *  type: 'timeline',
 *  args: { 
 *    prefix: string - a prefix string for the exported variables (default to id).
 *    timeField: 'timestamp' - The field containing timestamp
 *    lineField: 'channel' - A field to hold/group by different lines in the graph
 *    valueField: 'count' - holds the value/y value of the current point
 *  }
 * }
 * @param state Current received state from data source
 * @param dependencies Dependencies for the plugin
 * @param plugin The entire plugin (for id generation, params etc...)
 * @param prevState The previous state to compare for changing filters
 */
export function timeline(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  if (typeof format === 'string') { 
    return formatWarn('format should be an object with args', 'timeline', plugin);
  }

  const timeline = state.values;
  const { timespan } = dependencies;
  const args = format.args || {};
  const { timeField, lineField, valueField } = args;
  const prefix = getPrefix(format);

  let _timeline = {};
  let _lines = {};

  timeline.forEach(row => {
    let timestamp = row[timeField];
    let lineFieldValue = row[lineField];
    let valueFieldValue = row[valueField];

    let timeValue = (new Date(timestamp)).getTime();

    if (!_timeline[timeValue]) {
        _timeline[timeValue] = { time: (new Date(timestamp)).toUTCString() };
    }

    if (!_lines[lineFieldValue]) {
      _lines[lineFieldValue] = { name: lineFieldValue, value: 0 };
    }

    _timeline[timeValue][lineFieldValue] = valueFieldValue;
    _lines[lineFieldValue].value += valueFieldValue;
  });

  let lines = Object.keys(_lines);
  let usage = _.values(_lines);
  let timelineValues = _.map(_timeline, value => {
    lines.forEach(line => {
      if (!value[line]) { value[line] = 0; }
    });
    return value;
  });

  let result = {};
  result[prefix + 'graphData'] = timelineValues;
  result[prefix + 'timeFormat'] = (timespan === '24 hours' ? 'hour' : 'date');
  result[prefix + 'lines'] = lines;
  result[prefix + 'pieData'] = usage;

  return result;
}