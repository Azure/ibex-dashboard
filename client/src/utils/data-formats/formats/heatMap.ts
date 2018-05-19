import { DataFormatTypes, IDataFormat, formatWarn, getPrefix } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

export function heatMap(
  format: string | IDataFormat, 
  state: any, 
  dependencies: IDictionary, 
  plugin: IDataSourcePlugin, 
  prevState: any) {

    if (typeof format === 'string') { 
      return formatWarn('format should be an object with args', 'timeline', plugin);
    }
  
    const { timespan } = dependencies;
    const args = format.args || {};
    const { timeField, lineField, valueField } = args;
    const prefix = getPrefix(format);
    let values = state[args.data || 'values'];

    if (!values) { 
      return null; 
    }

    let result = {};
    result[prefix + 'values'] = values;
    
    return result;
}