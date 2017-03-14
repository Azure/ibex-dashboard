Object.defineProperty(exports, "__esModule", { value: true });
const DataSourcePlugin_1 = require("./DataSourcePlugin");
class Constant extends DataSourcePlugin_1.DataSourcePlugin {
    constructor(options) {
        super('Constant', 'selectedValue', options);
        var props = this._props;
        var params = options.params;
        props.actions.push.apply(props.actions, ['initialize', 'updateSelectedValue']);
    }
    initialize() {
        var { selectedValue, values } = this._props.params;
        return { selectedValue, values };
    }
    /**
     * updateDependencies - called when dependencies are created
     */
    updateDependencies(dependencies) {
        return dependencies;
    }
    updateSelectedValue(dependencies, selectedValue) {
        return { selectedValue };
    }
}
exports.default = Constant;
