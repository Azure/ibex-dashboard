Object.defineProperty(exports, "__esModule", { value: true });
class DataSourcePlugin {
    /**
     * @param {DataSourcePlugin} options - Options object
     */
    constructor(type, defaultProperty, options) {
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
    bind(actionClass) {
        actionClass.type = this.type;
        actionClass._props = this._props;
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
    getParamKeys() {
        return Object.keys(this._props.params);
    }
    getParams() {
        return this._props.params;
    }
    getCalculated() {
        return this._props.calculated;
    }
    failure(error) {
        return error;
    }
}
exports.DataSourcePlugin = DataSourcePlugin;
