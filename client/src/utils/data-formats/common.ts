import { ToastActions } from '../../components/Toast';
import { IDataSourcePlugin } from '../../data-sources/plugins/DataSourcePlugin';

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

export function formatWarn(text: string, format: string, plugin: IDataSourcePlugin) {
  ToastActions.addToast({ text: `[format:${format}] text [data source:${plugin._props.id}]` });
}

export function getPrefix(format: string | IDataFormat) {
  return (format && typeof format !== 'string' && format.args && format.args.prefix) || '';
}