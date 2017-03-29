type IDict<T> = { [id: string]: T };
type IDictionary = IDict<any>;
type IStringDictionary = IDict<string>;

type IConnection = IStringDictionary; 
type IConnections = IDict<IConnection>;

interface IDashboardConfig extends IDataSourceContainer, IElementsContainer {
  config: {
    connections: IConnections,
    layout: {
      isDraggable?: boolean
      isResizable?: boolean
      rowHeight?: number
      // This turns off compaction so you can place items wherever.
      verticalCompact?: boolean
      cols: { lg?: number, md?: number, sm?: number, xs?: number, xxs?: number }
      breakpoints: { lg?: number, md?: number, sm?: number, xs?: number, xxs?: number }
    }
  },
  filters: IFilter[]
  dialogs: IDialog[]
}

interface ILayout { 
  "i": string
  "x": number
  "y": number
  "w": number
  "h": number 
}

interface ILayouts { [id: string]: ILayout[] }

interface IDataSource {
  id: string
  type: string
  dependencies?: { [id: string]: string }
  params?: { [id: string]: any }
  calculated?: (state, dependencies) => { [index: string]: any }
}

interface IElement {
  id: string
  type: string
  size: { w: number, h: number }
  title?: string
  subtitle?: string
  theme?: string[]
  dependencies?: { [id: string]: string }
  props?: { [id: string]: any }
  actions?: { [id: string]: any }
}

interface IFilter {
  type: string
  dependencies?: { [id: string]: string }
  actions?: { [id: string]: string }
  first: boolean
}

interface IElementsContainer {
  elements: IElement[]  
}

interface IDataSourceContainer {
  dataSources: IDataSource[]
}

interface IDialog extends IDataSourceContainer, IElementsContainer {
  id: string
  width?: string | number
  params: string[]
}

type IAction = string | {
  action: string
  params: { [id: string]: string }
}