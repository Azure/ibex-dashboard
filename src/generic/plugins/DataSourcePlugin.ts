
export class DataSourceOptions {
  dependencies: (string | Object)[];
  /** This would be variable storing the results */
  dependables: (string | Object)[];
}

export abstract class DataSourcePlugin {

  type : string;

  _props = {
    id: '',
    type: 'none',
    dependencies: [],
    dependables: [],
    actions: [ 'updateDependencies', 'failure' ],
    listeners: [],
    params: {}
  }

  /**
   * @param {DataSourcePlugin} options - Options object
   */
  constructor(type, options) {

    this.type = type;

    var props = this._props;
    props.id = options.id;
    props.dependencies = options.dependencies || [];
    props.dependables = options.dependables || [];
    props.actions.push.apply(props.actions, options.actions || []);
    props.params = options.params || {};
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

  getParams() {
    return Object.keys(this._props.params);
  }

  listen(listener) {
    if (!this._props.listeners.find(func => func === listener)) {
      this._props.listeners.push(listener);
    }
  }

  updateDependables(dependablesDictionary) {
    this._props.listeners.forEach(listener => listener(dependablesDictionary));
  }

  failure(error): void { 
    return error;
  }
}