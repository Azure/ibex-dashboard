import alt from '../alt';
import * as _ from 'lodash';
import {IDataSourcePlugin} from './plugins/DataSourcePlugin';

export interface IDataSource {
  id: string;
  config : any;
  plugin : IDataSourcePlugin;
  action: any;
  store: any;
}

export interface IDataSourceDictionary {
  [key: string] : IDataSource;
}

export interface IExtrapolationResult {
  dataSources: { [key: string] : IDataSource };
  dependencies: { [key: string] : any };
}

export class PipeComponent {

  private static dataSources: IDataSourceDictionary = {};

  static createDataSource(dataSourceConfig) {

    var config = dataSourceConfig || {};
    if (!config.id || !config.type) {
      throw new Error('Data source configuration must contain id and type');
    }

    // Dynamically load the plugin from the plugins directory
    var pluginPath = './plugins/' + config.type + '.js';
    var PluginClass = require(pluginPath);
    var plugin : any = new PluginClass.default(config);
    
    // Creating actions class
    var ActionClass = PipeComponent.createActionClass(plugin);

    // Creating store class
    var StoreClass = PipeComponent.createStoreClass(config, plugin, ActionClass);

    PipeComponent.dataSources[config.id] = {
      id: config.id,
      config,
      plugin,
      action: ActionClass,
      store: StoreClass
    }

    return PipeComponent.dataSources[config.id];
  }

  static extrapolateDependencies(dependencies: { [ key: string] : string }): IExtrapolationResult {
    var result: IExtrapolationResult = {
      dataSources: {},
      dependencies: {}
    };
    Object.keys(dependencies).forEach(key => {
      
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
  }

  static triggerAction(action: string, args: any[]) {
    var actionLocation = action.split(':');

    if (actionLocation.length !== 2) {
      throw new Error(`Action triggers should be in format of "dataSource:action", this is not met by ${action}`);
    }

    var dataSourceName = actionLocation[0];
    var actionName = actionLocation[1];

    var dataSource = PipeComponent.dataSources[dataSourceName];
    dataSource.action[actionName].apply(dataSource.action, args);
  }

  private static createActionClass(plugin: IDataSourcePlugin) : any {
    class NewActionClass {
      constructor() {}
    };

    plugin.getActions().forEach(action => {

      if (typeof plugin[action] === 'function') {

        // This method will be called with an action is dispatched
        NewActionClass.prototype[action] = function (...args) {

          // Collecting depedencies from all relevant stores
          var extrapolation = PipeComponent.extrapolateDependencies(plugin.getDependencies());

          // Calling action with arguments
          var result = plugin[action].call(this, extrapolation.dependencies, ...args) || {};

          // Checking is result is a dispatcher or a direct value
          if (typeof result === 'function') {
            return (dispatch) => {
              result(function (obj) {
                obj = obj || {};
                var fullResult = PipeComponent.callibrateResult(obj, plugin);
                dispatch(fullResult);
              });
            }
          } else {
            var fullResult = PipeComponent.callibrateResult(result, plugin);
            return fullResult;
          }
        }
      } else {

        // Adding generic actions that are directly proxied to the store
        alt.addActions(action, <any>NewActionClass);
      }
    });

    // Binding the class to Alt and the plugin
    var ActionClass = alt.createActions(<any>NewActionClass);
    plugin.bind(ActionClass);

    return ActionClass;
  }

  private static createStoreClass(config: any, plugin: any, ActionClass: any): any {
    var bindings = [];
    plugin.getActions().forEach(action => {
      bindings.push(ActionClass[action]);
    });
    class NewStoreClass {
      constructor() {
        (<any>this).bindListeners({ updateState: bindings });
      }

      updateState(newData) {
        (<any>this).setState(newData);
      }
    };
    var StoreClass = alt.createStore(NewStoreClass, config.id + '-Store');;

    return StoreClass;
  }

  private static callibrateResult(result: any, plugin: IDataSourcePlugin) : any {

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
      Object.keys(additionalValues).forEach(key => {
        result[key] = additionalValues[key];
      });
    }

    return result;
  }
}