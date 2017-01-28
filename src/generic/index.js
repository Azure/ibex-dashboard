var alt_1 = require("../alt");
var PipeComponent = (function () {
    function PipeComponent() {
    }
    PipeComponent.createDataSource = function (dataSourceConfig) {
        var config = dataSourceConfig || {};
        if (!config.id || !config.type) {
            throw new Error('Data source configuration must contain id and type');
        }
        var pluginPath = './plugins/' + config.type + '.js';
        var PluginClass = require(pluginPath);
        var plugin = new PluginClass.default(config);
        // Creating actions class
        var NewActionClass = (function () {
            function NewActionClass() {
            }
            return NewActionClass;
        }());
        ;
        plugin.getActions().forEach(function (action) {
            if (typeof plugin[action] === 'function') {
                NewActionClass.prototype[action] = plugin[action];
            }
            else {
                alt_1.default.addActions(action, NewActionClass);
            }
        });
        var ActionClass = alt_1.default.createActions(NewActionClass);
        plugin.bind(ActionClass);
        // Creating store class
        var bindings = [];
        plugin.getActions().forEach(function (action) {
            bindings.push(ActionClass[action]);
        });
        var NewStoreClass = (function () {
            function NewStoreClass() {
                this.bindListeners({ updateState: bindings });
            }
            NewStoreClass.prototype.updateState = function (newData) {
                this.setState(newData);
            };
            return NewStoreClass;
        }());
        ;
        var StoreClass = alt_1.default.createStore(NewStoreClass, config.id + '-Store');
        ;
        PipeComponent.dataSources[config.id] = {
            config: config,
            plugin: plugin,
            action: ActionClass,
            store: StoreClass
        };
        return PipeComponent.dataSources[config.id];
    };
    return PipeComponent;
}());
exports.PipeComponent = PipeComponent;
PipeComponent.dataSources = {};
PipeComponent.stores = {};
PipeComponent.actions = {};
