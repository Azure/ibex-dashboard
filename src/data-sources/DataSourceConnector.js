Object.defineProperty(exports, "__esModule", { value: true });
const alt_1 = require("../alt");
const _ = require("lodash");
const Dialogs_1 = require("../components/generic/Dialogs");
class DataSourceConnector {
    static createDataSource(dataSourceConfig) {
        var config = dataSourceConfig || {};
        if (!config.id || !config.type) {
            throw new Error('Data source configuration must contain id and type');
        }
        // Dynamically load the plugin from the plugins directory
        var pluginPath = './plugins/' + config.type + '.js';
        var PluginClass = require(pluginPath);
        var plugin = new PluginClass.default(config);
        // Creating actions class
        var ActionClass = DataSourceConnector.createActionClass(plugin);
        // Creating store class
        var StoreClass = DataSourceConnector.createStoreClass(config, plugin, ActionClass);
        DataSourceConnector.dataSources[config.id] = {
            id: config.id,
            config,
            plugin,
            action: ActionClass,
            store: StoreClass
        };
        return DataSourceConnector.dataSources[config.id];
    }
    static createDataSources(dsContainer, containerDataSources) {
        dsContainer.dataSources.forEach(source => {
            var dataSource = DataSourceConnector.createDataSource(source);
            containerDataSources[dataSource.id] = dataSource;
        });
    }
    static connectDataSources(dataSources) {
        // Connect sources and dependencies
        var sourcesIDs = Object.keys(dataSources);
        sourcesIDs.forEach(sourceDSId => {
            var sourceDS = dataSources[sourceDSId];
            sourceDS.store.listen((state) => {
                sourcesIDs.forEach(checkDSId => {
                    var checkDS = dataSources[checkDSId];
                    var dependencies = checkDS.plugin.getDependencies() || {};
                    let connected = _.find(_.keys(dependencies), dependencyKey => {
                        let dependencyValue = dependencies[dependencyKey] || '';
                        return (dependencyValue === sourceDSId || dependencyValue.startsWith(sourceDSId + ':'));
                    });
                    if (connected) {
                        // Todo: add check that all dependencies are met
                        checkDS.action.updateDependencies.defer(state);
                    }
                });
            });
        });
        // Call initalize methods
        sourcesIDs.forEach(sourceDSId => {
            var sourceDS = dataSources[sourceDSId];
            if (typeof sourceDS.action['initialize'] === 'function') {
                sourceDS.action.initialize();
            }
        });
    }
    static extrapolateDependencies(dependencies, args) {
        var result = {
            dataSources: {},
            dependencies: {}
        };
        Object.keys(dependencies).forEach(key => {
            // Find relevant store
            let dependsUpon = dependencies[key].split(':');
            let dataSourceName = dependsUpon[0];
            if (dataSourceName === 'args' && args) {
                if (dependsUpon.length < 2) {
                    throw new Error('When padding arguments, you need to provide a specific argument name');
                }
                let valueName = dependsUpon[1];
                result.dependencies[key] = args[valueName];
            }
            else {
                let dataSource = DataSourceConnector.dataSources[dataSourceName];
                if (!dataSource) {
                    throw new Error('Could not find data source for depedency ' + dependencies[key]);
                }
                let valueName = dependsUpon.length > 1 ? dependsUpon[1] : dataSource.plugin.defaultProperty;
                var state = dataSource.store.getState();
                result.dependencies[key] = state[valueName];
                result.dataSources[dataSource.id] = dataSource;
            }
        });
        return result;
    }
    static triggerAction(action, params, args) {
        var actionLocation = action.split(':');
        if (actionLocation.length !== 2) {
            throw new Error(`Action triggers should be in format of "dataSource:action", this is not met by ${action}`);
        }
        var dataSourceName = actionLocation[0];
        var actionName = actionLocation[1];
        if (dataSourceName === 'dialog') {
            var extrapolation = DataSourceConnector.extrapolateDependencies(params, args);
            Dialogs_1.default.DialogsActions.openDialog(actionName, extrapolation.dependencies);
        }
        else {
            var dataSource = DataSourceConnector.dataSources[dataSourceName];
            if (!dataSource) {
                throw new Error(`Data source ${dataSourceName} was not found`);
            }
            dataSource.action[actionName].apply(dataSource.action, args);
        }
    }
    static createActionClass(plugin) {
        class NewActionClass {
            constructor() { }
        }
        ;
        plugin.getActions().forEach(action => {
            if (typeof plugin[action] === 'function') {
                // This method will be called with an action is dispatched
                NewActionClass.prototype[action] = function (...args) {
                    // Collecting depedencies from all relevant stores
                    var extrapolation = DataSourceConnector.extrapolateDependencies(plugin.getDependencies());
                    // Calling action with arguments
                    var result = plugin[action].call(this, extrapolation.dependencies, ...args) || {};
                    // Checking is result is a dispatcher or a direct value
                    if (typeof result === 'function') {
                        return (dispatch) => {
                            result(function (obj) {
                                obj = obj || {};
                                var fullResult = DataSourceConnector.callibrateResult(obj, plugin);
                                dispatch(fullResult);
                            });
                        };
                    }
                    else {
                        var fullResult = DataSourceConnector.callibrateResult(result, plugin);
                        return fullResult;
                    }
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
    }
    static createStoreClass(config, plugin, ActionClass) {
        var bindings = [];
        plugin.getActions().forEach(action => {
            bindings.push(ActionClass[action]);
        });
        class NewStoreClass {
            constructor() {
                this.bindListeners({ updateState: bindings });
            }
            updateState(newData) {
                this.setState(newData);
            }
        }
        ;
        var StoreClass = alt_1.default.createStore(NewStoreClass, config.id + '-Store');
        ;
        return StoreClass;
    }
    static callibrateResult(result, plugin) {
        var defaultProperty = plugin.defaultProperty || 'value';
        // In case result is not an object, push result into an object
        if (typeof result !== 'object') {
            var resultObj = {};
            resultObj[defaultProperty] = result;
            result = resultObj;
        }
        // Callibrate calculated values
        var calculated = plugin._props.calculated;
        var state = DataSourceConnector.dataSources[plugin._props.id].store.getState();
        state = _.extend(state, result);
        if (typeof calculated === 'function') {
            var additionalValues = calculated(state) || {};
            Object.keys(additionalValues).forEach(key => {
                result[key] = additionalValues[key];
            });
        }
        return result;
    }
}
DataSourceConnector.dataSources = {};
exports.DataSourceConnector = DataSourceConnector;
