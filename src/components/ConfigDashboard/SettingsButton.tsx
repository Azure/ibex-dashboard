import * as React from 'react';
import * as _ from 'lodash';
import Button from 'react-md/lib/Buttons/Button';
import Toolbar from 'react-md/lib/Toolbars';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';
import SelectField from 'react-md/lib/SelectFields';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import FontIcon from 'react-md/lib/FontIcons';

import Config from '../../pages/Config';
import SettingsStore from '../../stores/SettingsStore';
import SettingsActions from '../../actions/SettingsActions';
import ElementsSettings from './Elements/ElementsSettings'
import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';

interface ISettingsButtonState {
  showSettingsDialog:boolean;
  activeConfigView:string;
  dashboard?: IDashboardConfig;
}

interface ISettingsButtonProps {
  children?: any;
  onUpdateLayout:any;
}

export default class SettingsButton extends React.Component<ISettingsButtonProps, ISettingsButtonState> {
  
  ConfigurationViews = {
    ApplicationConnections:'Application Connections',
    Elements: 'Elements',
    DataSources: 'Data Sources',
    Filters: 'Filters'
  };

  state: ISettingsButtonState = {
    showSettingsDialog: false,
    activeConfigView: this.ConfigurationViews.ApplicationConnections,
    dashboard: null
  };

  constructor(props: ISettingsButtonProps) {
    super(props);

    
    this.onSettingsButtonClicked = this.onSettingsButtonClicked.bind(this);
    this.onSettingsDialogSaveClick = this.onSettingsDialogSaveClick.bind(this);
    this.onSettingsDialogCancelClick = this.onSettingsDialogCancelClick.bind(this);
    this.onChildSaveCompleted = this.onChildSaveCompleted.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onConfigDialogViewChange = this.onConfigDialogViewChange.bind(this);
    this.chooseComponentToDisplay =  this.chooseComponentToDisplay.bind(this);

     //initialize the dashboard state
      var configStorteState = ConfigurationsStore.getState();
      //never work on the original object, to allow cancel.
      var clonedDashboard = _.cloneDeep(configStorteState.dashboard);
      this.state.dashboard = clonedDashboard;
  }

   
  
  componentDidMount() {
      SettingsStore.listen(this.onStoreChange);
      
     


  }
  
  componentWillUnmount() {
        SettingsStore.unlisten(this.onStoreChange);
  }

  onStoreChange(state) {
    if(!state.isSavingSettings){
      //since we are passing parts of dashbaord by ref, and the cild elements just completed to update the data into it, we can safly save it with all the new changes.
      var dashboard = this.state.dashboard;
      var that = this;
      setTimeout(function(){
        ConfigurationsActions.saveConfiguration(dashboard);
        that.onChildSaveCompleted();
      },100);
        
    }
  }

  
  
  onSettingsButtonClicked() {
    this.setState({ showSettingsDialog: true });
  }

  onSettingsDialogSaveClick() {
      var dashboard = this.state.dashboard;
      var that = this;
      setTimeout(function(){
        ConfigurationsActions.saveConfiguration(dashboard);
        ConfigurationsActions.loadConfiguration();
        ConfigurationsActions.loadDashboard(dashboard.id);
        this.setState({ showSettingsDialog: false});
      },100);
  }

  onSettingsDialogCancelClick() {
    this.setState({ showSettingsDialog: false });
  }

  onChildSaveCompleted() {
  }

  onConfigDialogViewChange(newValue, newActiveIndex, event){
    this.setState({activeConfigView: newValue});
  }

  ///Display component based on user selection from dropdown menue
  chooseComponentToDisplay() {
    
    var elementsSettings:IElementsContainer = this.state.dashboard;

    switch(this.state.activeConfigView){

      case this.ConfigurationViews.ApplicationConnections:{
        var s = ConfigurationsStore.getState();
        return (<Config standaloneView={false} dashbaord={s.dashboard} connections={s.connections} />)
      }
      
      case this.ConfigurationViews.DataSources: {
        return (
          <ElementsSettings ElementsSettings={elementsSettings} />
        );
      }
      
      default:{
        return (
          <h1>{this.state.activeConfigView} - is not implemented yet</h1>
        );
      }

    }
  }

  render() {

    let { dashboard,showSettingsDialog } = this.state;
    var elementsSettings:IElementsContainer = this.state.dashboard;
    const titleMenu = (
      <SelectField
        key="titleMenu"
        id="titles"
        menuItems={[this.ConfigurationViews.ApplicationConnections,this.ConfigurationViews.DataSources,this.ConfigurationViews.Elements ,this.ConfigurationViews.Filters]}
        defaultValue={this.ConfigurationViews.ApplicationConnections}
        onChange={this.onConfigDialogViewChange}
      />);

    return (
        <span>
            <Button key="settings" icon tooltipLabel="Connections" onClick={this.onSettingsButtonClicked}>settings_applications</Button>
            <Dialog
                    id="settingsForm"
                    visible={showSettingsDialog}
                    modal
                    dialogStyle={{ width:'90%', height:'90%',"overflow-y":"auto"}}
                    
                    className='dialog-toolbar-no-padding'
                    actions={[
                        { onClick: this.onSettingsDialogSaveClick, primary: true, label: 'Save', },
                        { onClick: this.onSettingsDialogCancelClick, primary: false, label: 'Cancel' }
                    ]}
                    >
                    
                      <TabsContainer colored panelClassName="md-grid">
                        <Tabs tabId="settings-tabs">
                          <Tab label={this.ConfigurationViews.ApplicationConnections}>
                            <div className="md-cell md-cell--6">
                              <Config standaloneView={false} dashboardId={dashboard.id} connections={dashboard.config.connections} />
                            </div>
                          </Tab>
                          <Tab label={this.ConfigurationViews.Elements}>
                            <ElementsSettings ElementsSettings={elementsSettings}   />
                          </Tab>
                          <Tab label={this.ConfigurationViews.DataSources}>
                            <h1>{this.ConfigurationViews.DataSources} - is not implemented yet</h1>
                          </Tab>
                          <Tab label={this.ConfigurationViews.Filters}>
                            <h1>{this.ConfigurationViews.Filters} - is not implemented yet</h1>
                          </Tab>
                        </Tabs>
                    </TabsContainer>
                    
            </Dialog>  
      </span>
    );
  }
}