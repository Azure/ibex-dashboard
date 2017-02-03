var alt_1 = require("../alt");
var _ = require("lodash");
var PipeComponent = (function () {
    function PipeComponent() {
    }
    PipeComponent.createDataSource = function (dataSourceConfig) {
        var config = dataSourceConfig || {};
        if (!config.id || !config.type) {
            throw new Error('Data source configuration must contain id and type');
        }
        // Dynamically load the plugin from the plugins directory
        var pluginPath = './plugins/' + config.type + '.js';
        var PluginClass = require(pluginPath);
        var plugin = new PluginClass.default(config);
        // Creating actions class
        var ActionClass = PipeComponent.createActionClass(plugin);
        // Creating store class
        var StoreClass = PipeComponent.createStoreClass(config, plugin, ActionClass);
        PipeComponent.dataSources[config.id] = {
            id: config.id,
            config: config,
            plugin: plugin,
            action: ActionClass,
            store: StoreClass
        };
        return PipeComponent.dataSources[config.id];
    };
    PipeComponent.extrapolateDependencies = function (dependencies) {
        var result = {
            dataSources: {},
            dependencies: {}
        };
        Object.keys(dependencies).forEach(function (key) {
            // Find relevant store
            var dependsUpon = dependencies[key].split(':');
            var dataSourceName = dependsUpon[0];
            var dataSource = PipeComponent.dataSources[dataSourceName];
            if (!dataSource) {
                throw new Error('Could not find data source for depedency ' + dependencies[key]);
            }
            var valueName = dependsUpon.length > 1 ? dependsUpon[1] : dataSource.plugin.defaultProperty;
            var state = dataSource.store.getState();
            result.dependencies[key] = state[valueName];
            result.dataSources[dataSource.id] = dataSource;
        });
        return result;
    };
    PipeComponent.triggerAction = function (action, args) {
        var actionLocation = action.split(':');
        if (actionLocation.length !== 2) {
            throw new Error("Action triggers should be in format of \"dataSource:action\", this is not met by " + action);
        }
        var dataSourceName = actionLocation[0];
        var actionName = actionLocation[1];
        var dataSource = PipeComponent.dataSources[dataSourceName];
        dataSource.action[actionName].apply(dataSource.action, args);
    };
    PipeComponent.createActionClass = function (plugin) {
        var NewActionClass = (function () {
            function NewActionClass() {
            }
            return NewActionClass;
        }());
        ;
        plugin.getActions().forEach(function (action) {
            if (typeof plugin[action] === 'function') {
                // This method will be called with an action is dispatched
                NewActionClass.prototype[action] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    // Collecting depedencies from all relevant stores
                    var extrapolation = PipeComponent.extrapolateDependencies(plugin.getDependencies());
                    // Calling action with arguments
                    var result = (_a = plugin[action]).call.apply(_a, [this, extrapolation.dependencies].concat(args)) || {};
                    // Checking is result is a dispatcher or a direct value
                    if (typeof result === 'function') {
                        return function (dispatch) {
                            result(function (obj) {
                                obj = obj || {};
                                var fullResult = PipeComponent.callibrateResult(obj, plugin);
                                dispatch(fullResult);
                            });
                        };
                    }
                    else {
                        var fullResult = PipeComponent.callibrateResult(result, plugin);
                        return fullResult;
                    }
                    var _a;
                };
            }
            else {
                // Adding generic actions that are directly proxied to the store
                alt_1.default.addActions(action, NewActionClass);
            }
        });
        // Binding the class to Alt and the plugin
        var ActionClass = alt_1.default.createActions(NewActionClass);
        plugin.bind(ActionClass);
        return ActionClass;
    };
    PipeComponent.createStoreClass = function (config, plugin, ActionClass) {
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
        return StoreClass;
    };
    PipeComponent.callibrateResult = function (result, plugin) {
        var defaultProperty = plugin.defaultProperty || 'value';
        // In case result is not an object, push result into an object
        if (typeof result !== 'object') {
            var resultObj = {};
            resultObj[defaultProperty] = result;
            result = resultObj;
        }
        // Callibrate calculated values
        var calculated = plugin._props.calculated;
        var state = PipeComponent.dataSources[plugin._props.id].store.getState();
        state = _.extend(state, result);
        if (typeof calculated === 'function') {
            var additionalValues = calculated(state) || {};
            Object.keys(additionalValues).forEach(function (key) {
                result[key] = additionalValues[key];
            });
        }
        return result;
    };
    return PipeComponent;
}());
exports.PipeComponent = PipeComponent;
PipeComponent.dataSources = {};
