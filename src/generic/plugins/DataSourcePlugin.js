var DataSourcePlugin = (function () {
    /**
     * @param {DataSourcePlugin} options - Options object
     */
    function DataSourcePlugin(type, defaultProperty, options) {
        this._props = {
            id: '',
            type: 'none',
            dependencies: {},
            dependables: [],
            actions: ['updateDependencies', 'failure'],
            params: {},
            calculated: {}
        };
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
    DataSourcePlugin.prototype.getParamKeys = function () {
        return Object.keys(this._props.params);
    };
    DataSourcePlugin.prototype.getParams = function () {
        return this._props.params;
    };
    DataSourcePlugin.prototype.getCalculated = function () {
        return this._props.calculated;
    };
    DataSourcePlugin.prototype.failure = function (error) {
        return error;
    };
    return DataSourcePlugin;
}());
exports.DataSourcePlugin = DataSourcePlugin;
