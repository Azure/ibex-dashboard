/// <reference path="./constant.d.ts"/>
/// <reference path="./ai.d.ts"/>
/// <reference path="./sample.d.ts"/>

type IDict<T> = { [id: string]: T };
type IDictionary = IDict<any>;
type IStringDictionary = IDict<string>;

type IConnection = IStringDictionary; 
type IConnections = IDict<IConnection>;

/**
 * Dashboard configuration schema
 */
interface IDashboardConfig extends IDataSourceContainer, IElementsContainer {
  /** 
   * Unique id for the template to be used when looking up a dashboard
   */
  id: string,
  /**
   * Name to be displayed in navigation
   */
  name: string,
  /**
   * Icon to be displayed in navigation (see https://material.io/icons/)
   * Optional [Default: 'dashboard']
   */
  icon?: string,
  /**
   * An image logo to be diaplyed next to the title of the dashboard in the navigation header.
   * Optional [Default: None]
   */
  logo?: string,
  /**
   * The string to be used in the url (should be identical to id)
   */
  url: string,
  /**
   * A short description to display under the template in the dashboard creation screen 
   */
  description?: string,
  /**
   * An html full description to be displayed in a dialog in the dashboard creation screen
   */
  html?: string,
  /**
   * A preview image to show on the background of the template in the dashboard creation screen
   */
  preview?: string,
  /**
   * The category to put this template in the dashboard creation screen
   */
  category?: string,

  /**
   * Configuration relevant for the current dashboard
   */
  config: {
    /**
     * A dictionary of connection paramters.
     * connections: {
     *  "application-insights": { appId: "123456", apiKey: "123456" },
     *  "cosmos-db": { ... }
     * }
     */
    connections: IConnections,

    /**
     * react-grid-layout properties.
     * To read more, see https://github.com/STRML/react-grid-layout#grid-layout-props
     */
    layout: {
      isDraggable?: boolean,
      isResizable?: boolean,
      rowHeight?: number,
      verticalCompact?: boolean, // Turns off compaction so you can place items wherever.
      cols: Sizes<number>,
      breakpoints: Sizes<number>
    }
  },
  filters: IFilter[]
  dialogs: IDialog[],
  layouts?: ILayouts
}

/**
 * =============================
 *        Data Sources
 * =============================
 */

type DataSource = ConstantDataSource | AIDataSource | SampleDataSource;
 
 /**
  * Data Source properties in a dashboard definition
  */
interface IDataSource {
  /**
   * The name/type of the data source - should be in the data source `type` property
   */
  type: string,
  /**
   * id for the data source - used to associate to this data source as a dependency
   */
  id: string,
  /**
   * Dependencies required for this data source to work (Optional).
   * 
   * Format:
   * dependencies: {
   *  "timespan": "data_source_id" // This will use the default property of the data source
   *  "timespan2": "data_source_id:data_source_property"
   * }
   */
  dependencies?: IStringDictionary,
  /**
   * Parameters required / optional by the specific data source (defined differently or each data source)
   */
  params?: IDictionary,
  /**
   * The format to use for transforming the data into a visual component
   */
  format?: string | {
    type: string,
    args?: IDictionary
  }
  /**
   * An optional method to apply additional transformations to the data returned from this data source.
   * The data returned will augment the data source's data and will be usable by external dependencies.
   * 
   * {
   *  id: "dataSource1",
   *  ...,
   *  calculated: (state, dependencies, prevState) => {
   *    return {
   *      "more-data": [],
   *      "more-data2": 4
   *    };
   *  }
   * }
   * 
   * Then, in another data source:
   * dependencies: {
   *  values: "dataSource1:more-data"
   * }
   */
  calculated?: (state: any, dependencies?: any, prevState?: any) => IDictionary
}

/**
 * An element that can hold one or multiple data sourecs
 */
interface IDataSourceContainer {
  dataSources: DataSource[]
}

/**
 * ====================================
 * Layouts definitions
 * ====================================
 */

interface Sizes<T> {
  lg?: T,
  md?: T,
  sm?: T,
  xs?: T,
  xxs?: T
}

interface ILayout { 
  "i": string,
  "x": number,
  "y": number,
  "w": number,
  "h": number,
  minW: number,
  maxW: number,
  minH: number,
  maxH: number,
  moved: boolean,
  static: boolean,
  isDraggable: boolean,
  isResizable: boolean
}

type ILayouts = Sizes<ILayout[]>;

/**
 * ====================================
 * Template schema definitions
 * ====================================
 */

interface IElement {
  id: string;
  type: string;
  size: { w: number, h: number };
  location?: { x: number, y: number };
  title?: string;
  subtitle?: string;
  theme?: string[];
  source?: string | IStringDictionary;
  dependencies?: IStringDictionary;
  props?: IDictionary;
  actions?: IDictionary;
}

interface IFilter {
  type: string,
  source?: string,
  dependencies?: IStringDictionary,  
  actions?: IStringDictionary,
  title?: string,
  subtitle?: string,
  icon?: string,
  first?: boolean
}

interface IElementsContainer {
  elements: IElement[]  
}

interface IDialog extends IDataSourceContainer, IElementsContainer {
  id: string
  width?: string | number
  params: string[]
}

type IAction = string | {
  action: string,
  params: IStringDictionary
}

interface ISetupConfig {
  stage: string;
  admins: string[];
  enableAuthentication: boolean;
  allowHttp: boolean;
  redirectUrl: string;
  clientID: string;
  clientSecret: string;
  issuer: string;
}