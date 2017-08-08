import * as _ from 'lodash';
import utils from '../../index';
import { DataFormatTypes, IDataFormat } from '../common';
import { IDataSourcePlugin } from '../../../data-sources/plugins/DataSourcePlugin';

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