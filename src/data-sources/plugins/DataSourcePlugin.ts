
export interface IDataSourceOptions {
  dependencies: (string | Object)[];
  /** This would be variable storing the results */
  dependables: (string | Object)[];
}

export interface ICalculated { 
  [ key: string] : (state: Object, dependencies: { [ key: string] : any }) => any 
}

export interface IDataSourcePlugin {

  type : string;
  defaultProperty: string;

  _props: {
    id: string,
    type: string,
    dependencies: { [ key: string] : string },
    dependables: string[],
    actions: string[],
    params: { [ key: string] : any },
    calculated: ICalculated
  }

  bind (actionClass) : void;
  updateDependencies (dependencies, callback) : void;
  getDependencies() : { [ key: string] : string };
  getDependables() : string[];
  getActions() : string[];
  getParamKeys() : string[];
  getParams() : { [ key: string] : any };
  getCalculated() : ICalculated;
}

export abstract class DataSourcePlugin implements IDataSourcePlugin {

  type : string;
  defaultProperty: string;

  _props = {
    id: '',
    type: 'none',
    dependencies: <any>{},
    dependables: [],
    actions: [ 'updateDependencies', 'failure' ],
    params: {},
    calculated: {}
  }

  /**
   * @param {DataSourcePlugin} options - Options object
   */
  constructor(type, defaultProperty, options) {

    this.type = type;
    this.defaultProperty = defaultProperty;

    var props = this._props;
    props.id = options.id;
    props.dependencies = options.dependencies || [];
    props.dependables = options.dependables || [];
    props.actions.push.apply(props.actions, options.actions || []);
    props.params = options.params || {};
    props.calculated = options.calculated || {};
  }

  bind (actionClass) {
    actionClass.type = this.type;
    actionClass._props = this._props;
  }

  abstract updateDependencies (dependencies, callback) : void;

  /**
   * @returns {string[]} Array of dependencies
   */
  getDependencies() {
    return this._props.dependencies;
  }

  getDependables() {
    return this._props.dependables;
  }

  getActions() {
    return this._props.actions;
  }

  getParamKeys() {
    return Object.keys(this._props.params);
  }

  getParams() {
    return this._props.params;
  }

  getCalculated() {
    return this._props.calculated;
  }

  failure(error): void { 
    return error;
  }
}