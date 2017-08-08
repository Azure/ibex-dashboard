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