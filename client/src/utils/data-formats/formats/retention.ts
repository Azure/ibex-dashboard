import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

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
 *                     should contain "selectedTimespan" equals to 'PT24H', 'P7D' etc...
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

  if (!values || !values.length) { return null; }
  
  const prefix = getPrefix(format);
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
  
  _.extend(result, values[0]);

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

  result[prefix + 'values'] = [
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