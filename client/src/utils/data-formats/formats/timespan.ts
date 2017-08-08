import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

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