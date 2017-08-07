import * as _ from 'lodash';
import utils from './index';
import { IDataSourcePlugin } from '../data-sources/plugins/DataSourcePlugin';

export enum DataFormatTypes {
  none,
  timespan,
  flags,
  retention,
  timeline
}

export interface IDataFormat {
  type: string;
  args: any;
}

export function timespan(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  if (!state) { return null; }

  const params = plugin.getParams();
  let prefix = (typeof format !== 'string' && format.args && format.args.prefix) || plugin._props.id;
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
  result[prefix + '-values'] = params.values;
  result[prefix + '-selected'] = state.selectedValue;

  return result;
}

export function flags(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  const params = plugin.getParams();

  if (!state || !params || !Array.isArray(params.values)) { return null; }

  let prefix = (typeof format !== 'string' && format.args && format.args.prefix) || plugin._props.id;
  let flags = {};
  params.values.forEach(key => { flags[key] = state.selectedValue === key; });

  flags[prefix + '-values'] = params.values;
  flags[prefix + '-selected'] = state.selectedValue;

  return flags;
}

export function scorecard (
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {
  let { values } = state;

  const args = typeof format !== 'string' && format.args || { thresholds: null };
  const countField = args.countField || 'count';
  const postfix = args.postfix || null;
  let checkValue = (values && values[0] && values[0][countField]) || 0; 
  
  let createValue = (value: any, heading: string, color: string, icon: string, subvalue?: any, subheading?: string) => {
    let item = {};
    let prefix = args && args.prefix || plugin._props.id;
    item[prefix + '-value'] = utils.kmNumber(value, postfix);
    item[prefix + '-heading'] = heading;
    item[prefix + '-color'] = color;
    item[prefix + '-icon'] = icon;
    item[prefix + '-subvalue'] = subvalue || '';
    item[prefix + '-subheading'] = subheading || '';
    return item;
  };

  let thresholds = args.thresholds || [ ];
  if (!thresholds.length) { 
    thresholds.push({ value: checkValue, heading: '', color: '#000', icon: 'done' });
  }
  let firstThreshold = thresholds[0];

  if (!values || !values.length) { 
    return createValue(
      firstThreshold.value, 
      firstThreshold.heading, 
      firstThreshold.color, 
      firstThreshold.icon
    );  
  }

  // Todo: check validity of thresholds and each value

  let thresholdIdx = 0;
  let threshold = thresholds[thresholdIdx];
  
  while (thresholds.length > (thresholdIdx + 1) && 
         checkValue > threshold.value &&    
         checkValue >= thresholds[++thresholdIdx].value) {
    threshold = thresholds[thresholdIdx];      
  }

  let subvalue = null;
  let subheading = null;
  if (args.subvalueField || args.subvalueThresholds) {
    let subvalueField = args.subvalueField || null;
    let subvalueThresholds = args.subvalueThresholds || [];

    if (!subvalueThresholds.length) { subvalueThresholds.push({ subvalue: 0, subheading: '' }); }
    
    checkValue = values[0][subvalueField || countField] || 0;
    thresholdIdx = 0;
    let subvalueThreshold = subvalueThresholds[thresholdIdx];
    
    while (subvalueThresholds.length > (thresholdIdx + 1) && 
           checkValue > subvalueThreshold.value &&
           checkValue >= subvalueThresholds[++thresholdIdx].value) {
      subvalueThreshold = subvalueThresholds[thresholdIdx];      
    }

    subvalue = checkValue;
    subheading = subvalueThreshold.subheading;
  }

  return createValue(checkValue, threshold.heading, threshold.color, threshold.icon, subvalue, subheading);
}

/**
 * Received a result in the form of:
 * values: [
 *  {
 *    totalUnique: number
 *    totalUniqueUsersIn24hr: number
 *    totalUniqueUsersIn7d: number
 *    totalUniqueUsersIn30d: number
 *    returning24hr: number
 *    returning7d: number
 *    returning30d: number
 *  }
 * ]
 *
 * And returns the following format:
 * {
 *  total: number
 *  returning: number
 *  values: [
 *    { 
 *      timespan: '24 hours', 
 *      retention: '%',
 *      returning: number,
 *      unique:number 
 *    },
 *    { 
 *      timespan: '7 days', 
 *      retention: '%',
 *      returning: number,
 *      unique:number 
 *    }
 *    { 
 *      timespan: '30 days', 
 *      retention: '%',
 *      returning: number,
 *      unique:number 
 *    }
 *  ]
 * }
 * 
 * @param format Plugin format parameter
 * @param state Current received state from data source
 * @param dependencies Dependencies for the plugin
 * @param plugin The entire plugin (for id generation, params etc...)
 */
export function retention (
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {
  const { values } = state;
  const { selectedTimespan } = dependencies;

  let result = {
    totalUnique: 0,
    totalUniqueUsersIn24hr: 0,
    totalUniqueUsersIn7d: 0,
    totalUniqueUsersIn30d: 0,
    returning24hr: 0,
    returning7d: 0,
    returning30d: 0,

    total: 0,
    returning: 0,
    values: []
  };

  if (values && values.length) {
    _.extend(result, values[0]);
  }

  switch (selectedTimespan) {
    case 'PT24H':
      result.total = result.totalUniqueUsersIn24hr;
      result.returning = result.returning24hr;
      break;

    case 'P7D':
      result.total = result.totalUniqueUsersIn7d;
      result.returning = result.returning7d;
      break;

    case 'P30D':
      result.total = result.totalUniqueUsersIn30d;
      result.returning = result.returning30d;
      break;

    default:
      result.total = 0;
      result.returning = 0;
      break;
  }

  result.values = [
    { 
      timespan: '24 hours', 
      retention: Math.round(100 * result.returning24hr / result.totalUniqueUsersIn24hr || 0) + '%',
      returning: result.returning24hr,
      unique: result.totalUniqueUsersIn24hr 
    },
    { 
      timespan: '7 days', 
      retention: Math.round(100 * result.returning7d / result.totalUniqueUsersIn7d || 0) + '%',
      returning: result.returning7d,
      unique: result.totalUniqueUsersIn7d
    },
    { 
      timespan: '30 days', 
      retention: Math.round(100 * result.returning30d / result.totalUniqueUsersIn30d || 0) + '%',
      returning: result.returning30d,
      unique: result.totalUniqueUsersIn30d
    },
  ];

  return result;
}

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
 *  type: 'filter',
 *  args: { 
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

  if (typeof format === 'string') { return {}; }

  const timeline = state.values;
  const { timespan } = dependencies;
  const args = format.args || {};
  const { timeField, lineField, valueField } = args;
  let prefix = args.prefix || 'timeline';

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
  result[prefix + '-graphData'] = timelineValues;
  result[prefix + '-usage'] = usage;
  result[prefix + '-timeFormat'] = (timespan === '24 hours' ? 'hour' : 'date');
  result[prefix + '-lines'] = lines;

  return result;
}

export function bars(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

  if (!format || typeof format === 'string') { return null; }
  
  const args = format.args || {};
  const prefix = args.prefix || 'prefix';
  const valueField = args.valueField || 'count';
  const barsField = args.barsField || null;
  const seriesField = args.seriesField || null;
  const valueMaxLength = args.valueMaxLength && parseInt(args.valueMaxLength, 10) || 13;
  const threshold = args.threshold || 0;
  const othersField = args.othersField || 'Others';

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
        barValues[val[barsField]][othersField] = (barValues[val[barsField]][othersField] || 0) + val[valueField];
        series[othersField] = true;
      } else {
        barValues[val[barsField]][val[seriesField]] = val[valueField];
        series[val[seriesField]] = true;
      }
    });

    result[prefix + '-bars'] = _.keys(series);
    result[prefix + '-values'] = _.values(barValues);

  } else {
    result[prefix + '-bars'] = [ valueField ];
    result[prefix + '-values'] = values;
  }

  return result;
}