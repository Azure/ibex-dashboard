import * as React from 'react';
import * as _ from 'lodash';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';

import { DataSourceConnector, IDataSourceDictionary } from '../../data-sources';
import connections from '../../data-sources/connections';

import ConnectionsStore from '../../stores/ConnectionsStore';
import ConnectionsActions from '../../actions/ConnectionsActions';


import SettingsStore from '../../stores/SettingsStore';
import SettingsActions from '../../actions/SettingsActions';

interface IConfigDashboardState {
  connections: IDictionary;
  error: string;
  
}

interface IConfigDashboardProps {
  connections: IDictionary;
  standaloneView:boolean;
  dashboardId:string;
}

export default class ConfigDashboard extends React.Component<IConfigDashboardProps, IConfigDashboardState> {

  state: IConfigDashboardState = {
    connections: {},
    error: null
  };

  
  constructor(props: any) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSaveGoToDashboard = this.onSaveGoToDashboard.bind(this);
    this.redirectToHomepageIfStandalone = this.redirectToHomepageIfStandalone.bind(this);
    this.state.connections = this.props.connections;
  }


  onParamChange(connectionKey: string, paramKey: string, value: any) {
    let { connections } = this.state;
    connections[connectionKey] = connections[connectionKey] || {};
    connections[connectionKey][paramKey] = value;
  }

  onSave() {
    
  }

  onSaveGoToDashboard() {
    this.onSave();
    if(this.props.standaloneView){

      //why is there a timer here and not a callback?
      setTimeout(() => {
        this.redirectToHomepageIfStandalone();    
      }, 2000);
    }
  }

  onCancel() {
    this.redirectToHomepageIfStandalone();    
  }

  redirectToHomepageIfStandalone(){
    if(this.props.standaloneView){
      let { dashboardId} = this.props;
        window.location.replace(`/dashboard/${dashboardId}`); 
    }
  }

  displayToolbarIfStandalone() {
    if (this.props.standaloneView) {
      return (
        <div>
          <Button flat primary label="Save" onClick={this.onSave}>save</Button>
          <Button flat secondary label="Save and Go to Dashboard" onClick={this.onSaveGoToDashboard}>save</Button>
          <Button flat secondary label="Cancel" onClick={this.onCancel}>cancel</Button>
        </div>
      );
    } else {
      return null;
    }
  }
  render() {

    

    let { error,connections } = this.state;

    return (
      <div style={{ width: '100%' }}>
        {_.keys(connections).map(connectionKey => {
          
          if (connections[connectionKey].editor) {
            var EditorClass = connections[connectionKey].editor;
            return (
              <div key={connectionKey}>
                <EditorClass connection={connections[connectionKey]} onParamChange={this.onParamChange.bind(this)} />
              </div>
            );
          } else {
            return (
              <div key={connectionKey}>
                <h2>{connectionKey}</h2>
                {
                  _.keys(connections[connectionKey]).map(paramKey => (
                    <div key={paramKey}>
                      <TextField
                        id="paramKey"
                        label={paramKey}
                        defaultValue={connections[connectionKey] && connections[connectionKey][paramKey] || ''}
                        lineDirection="center"
                        placeholder="Fill in required connection parameter"
                        className="md-cell md-cell--bottom"
                        onChange={this.onParamChange.bind(this, connectionKey, paramKey)}
                      />
                    </div>
                  ))
                }
              </div>
            );
          }
        })}
        
        {this.displayToolbarIfStandalone()}
        
      </div>
    );
  }
}
