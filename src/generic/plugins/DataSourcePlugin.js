var DataSourceOptions = (function () {
    function DataSourceOptions() {
    }
    return DataSourceOptions;
}());
exports.DataSourceOptions = DataSourceOptions;
var DataSourcePlugin = (function () {
    /**
     * @param {DataSourcePlugin} options - Options object
     */
    function DataSourcePlugin(type, options) {
        this._props = {
            id: '',
            type: 'none',
            dependencies: [],
            dependables: [],
            actions: ['updateDependencies', 'failure'],
            listeners: [],
            params: {}
        };
        this.type = type;
        var props = this._props;
        props.id = options.id;
        props.dependencies = options.dependencies || [];
        props.dependables = options.dependables || [];
        props.actions.push.apply(props.actions, options.actions || []);
        props.params = options.params || {};
    }
    DataSourcePlugin.prototype.bind = function (actionClass) {
        actionClass.type = this.type;
        actionClass._props = this._props;
    };
    /**
     * @returns {string[]} Array of dependencies
     */
    DataSourcePlugin.prototype.getDependencies = function () {
        return this._props.dependencies;
    };
    DataSourcePlugin.prototype.getDependables = function () {
        return this._props.dependables;
    };
    DataSourcePlugin.prototype.getActions = function () {
        return this._props.actions;
    };
    DataSourcePlugin.prototype.getParams = function () {
        return Object.keys(this._props.params);
    };
    DataSourcePlugin.prototype.listen = function (listener) {
        if (!this._props.listeners.find(function (func) { return func === listener; })) {
            this._props.listeners.push(listener);
        }
    };
    DataSourcePlugin.prototype.updateDependables = function (dependablesDictionary) {
        this._props.listeners.forEach(function (listener) { return listener(dependablesDictionary); });
    };
    DataSourcePlugin.prototype.failure = function (error) {
        return error;
    };
    return DataSourcePlugin;
}());
exports.DataSourcePlugin = DataSourcePlugin;
