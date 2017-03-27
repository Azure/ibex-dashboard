import alt, { AbstractStoreModel } from '../alt';
import * as _ from 'lodash';

import connections from '../data-sources/connections';
import { DataSourceConnector, IDataSourceDictionary } from '../data-sources';
import configurationActions from '../actions/ConfigurationsActions';

interface IConfigurationsStoreState {
  dashboard: IDashboardConfig;
  connections: IDictionary;
  connectionsMissing: boolean;
  loaded: boolean;
}

class ConfigurationsStore extends AbstractStoreModel<IConfigurationsStoreState> implements IConfigurationsStoreState {

  dashboard: IDashboardConfig;
  connections: IDictionary;
  connectionsMissing: boolean;
  loaded: boolean;

  constructor() {
    super();

    this.dashboard = null;
    this.connections = {};    
    this.connectionsMissing = false;
    this.loaded = false;

    this.bindListeners({
      loadConfiguration: configurationActions.loadConfiguration
    });
  }
  
  loadConfiguration(dashboard: IDashboardConfig) {
    this.dashboard = dashboard;

    if (this.dashboard && !this.loaded) {
      DataSourceConnector.createDataSources(dashboard, dashboard.config.connections);
      
      this.connections = this.getConnections(dashboard);

      // Checking for missing connection params
      this.connectionsMissing = Object.keys(this.connections).some(connectionKey => {
        var connection = this.connections[connectionKey];
        
        return Object.keys(connection).some(paramKey => !connection[paramKey]);
      })
    }
  }

  private getConnections(dashboard: IDashboardConfig): any {
    let requiredParameters = {};
    let dataSources = DataSourceConnector.getDataSources();
    _.values(dataSources).forEach(dataSource => {

      // If no connection requirements were set, return
      let connectionTypeName = dataSource.plugin.connectionType;
      if (!connectionTypeName) {
        return;
      }

      if (!connections[connectionTypeName]) {
        throw new Error(`No connection names ${connectionTypeName} was defined`);
      }

      var connectionType = connections[connectionTypeName];
      requiredParameters[connectionTypeName] = {};
      connectionType.params.forEach(param => { requiredParameters[connectionTypeName][param] = null });

      // Connection type is already defined - check params
      if (dashboard.config.connections[connectionTypeName]) {
        var connectionParams = dashboard.config.connections[connectionTypeName];

        // Checking that all param definitions are defined
        connectionType.params.forEach(param => {
          requiredParameters[connectionTypeName][param] = connectionParams[param];
        });
      }
    });

    return requiredParameters;
  }
}

const configurationsStore = alt.createStore<IConfigurationsStoreState>(ConfigurationsStore, 'ConfigurationsStore');

export default configurationsStore;
