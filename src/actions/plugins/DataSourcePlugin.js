
export class DataSourceOptions {
  /** @type {(string|object)[]} dependencies */
  dependencies;
  /** @type {(string|object)[]} dependables - This would be variable storing the results */
  dependables;
}

export class DataSourcePlugin {

  _props = {
    type: 'none',
    dependencies: [],
    dependables: [],
    actions: [],
    listeners: [],
    params: {}
  }

  /**
   * @param {DataSourcePlugin} options - Options object
   */
  constructor(options, parameters) {

    if (!this.type) {
      throw new Error('a plugin should provide a type name.');
    }

    var props = this._props;
    props.type = this.type;
    props.dependencies = options.dependencies || [];
    props.dependables = options.dependables || [];
    props.actions = options.actions || [];

    props.params = parameters || {};
  }

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
    this._props.listeners.forEach(listener => func(dependablesDictionary));
  }

  /**
   * update - called when dependencies are created
   * @param {object} dependencies
   * @param {function} callback
   */
  updateDependencies(dependencies, callback) {

    var { timespan } = dependencies;

    // TODO: insert dependencies into query [format]or[function]

    if (this._props.type == 'generic') {
      this._fetchQuery({timespan}, callback);
    } else {
      this._fetchEvents(dependencies, callback);
    }
  }
}