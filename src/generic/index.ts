import alt from '../alt';
import * as React from 'React';
import Timeline from '../components/Dashboard/Graphs/Timeline';
import {DataSourcePlugin} from './plugins/DataSourcePlugin';

export class PipeComponent {

  private static dataSources = {};
  private static stores = {};
  private static actions = {};

  static createDataSource(dataSourceConfig) {

    var config = dataSourceConfig || {};
    if (!config.id || !config.type) {
      throw new Error('Data source configuration must contain id and type');
    }

    var pluginPath = './plugins/' + config.type + '.js';
    var PluginClass = require(pluginPath);
    var plugin : DataSourcePlugin = new PluginClass.default(config);
    
    // Creating actions class
    class NewActionClass {
      constructor() {}
    };

    plugin.getActions().forEach(action => {

      if (typeof plugin[action] === 'function') {
        NewActionClass.prototype[action] = plugin[action];
      } else {
        alt.addActions(action, <any>NewActionClass);
      }
    });
    var ActionClass = alt.createActions(<any>NewActionClass);
    plugin.bind(ActionClass);

    // Creating store class
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

    PipeComponent.dataSources[config.id] = {
      config,
      plugin,
      action: ActionClass,
      store: StoreClass
    }

    return PipeComponent.dataSources[config.id];
  }
}