type IDictionary = { [ id: string ] : Object }
type IStringDictionary = { [ id: string ] : string }

interface IDashboardConfig {
  config: {
    layout: {
      isDraggable?: boolean,
      isResizable?: boolean,
      rowHeight?: number,
      // This turns off compaction so you can place items wherever.
      verticalCompact?: boolean,
      cols: { lg?: number, md?: number, sm?: number, xs?: number, xxs?: number },
      breakpoints: { lg?: number, md?: number, sm?: number, xs?: number, xxs?: number }
    }
  },
  dataSources: IDataSource[],
  filters: IFilter[],
  elements: IElement[],
  dialogs: IDialog[]
}

interface ILayout { 
  "i": string, 
  "x": number, 
  "y": number, 
  "w": number, 
  "h": number 
}

interface ILayouts { [id: string]: ILayout[] }

interface IDataSource {
  id: string,
  type: string,
  dependencies?: { [id: string]: string },
  params?: { [id: string]: any },
  calculated?: (state, dependencies) => { [index: string]: any }
}

interface IElement {
  id: string,
  type: string,
  size: { w: number, h: number },
  title?: string,
  subtitle?: string,
  dependencies?: { [id: string]: string },
  props?: { [id: string]: any },
  actions?: { [id: string]: any }
}

interface IFilter {
  type: string,
  dependencies?: { [id: string]: string },
  actions?: { [id: string]: string },
  first: boolean
}

interface IDialog {
  id: string,
  params: string[],
  dataSources: IDataSource[],
  elements: IElement[]
}

type IAction = string | {
  action: string,
  params: { [id: string]: string }
}