import * as React from 'react';

import Button from 'react-md/lib/Buttons/Button';
import Toolbar from 'react-md/lib/Toolbars';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';
import SelectField from 'react-md/lib/SelectFields';

import Config from '../../pages/Config';
import SettingsStore from '../../stores/SettingsStore';
import SettingsActions from '../../actions/SettingsActions';
import ElementsSettings from './Elements/ElementsSettings'
import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';

interface ISettingsButtonState {
  shouldSave: boolean;
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
    ApplicationInsights:'Application Insights',
    Elements: 'Elements',
    DataSources: 'Data Sources',
    Filters: 'Filters'
  };

  state: ISettingsButtonState = {
    shouldSave: false,
    showSettingsDialog: false,
    activeConfigView: this.ConfigurationViews.ApplicationInsights,
    dashboard: null
  };

  constructor(props: ISettingsButtonProps) {
    super(props);

    this.save = this.save.bind(this);
    this.doneSaving = this.doneSaving.bind(this);
    this.onSettingsButtonClicked = this.onSettingsButtonClicked.bind(this);
    this.onSettingsDialogSaveClick = this.onSettingsDialogSaveClick.bind(this);
    this.onSettingsDialogCancelClick = this.onSettingsDialogCancelClick.bind(this);
    this.onChildSaveCompleted = this.onChildSaveCompleted.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
    this.onConfigDialogViewChange = this.onConfigDialogViewChange.bind(this);
    this.chooseComponentToDisplay =  this.chooseComponentToDisplay.bind(this);

    //ConfigurationsActions.loadConfiguration();
  }

   
  
  componentDidMount() {
      SettingsStore.listen(this.onStoreChange);
      
      //initialize the dashboard state
      var configStorteState = ConfigurationsStore.getState();
      this.setState({dashboard:configStorteState.dashboard});

      //update the dashbaord state on change
      ConfigurationsStore.listen(state => {
        var configStorteState = ConfigurationsStore.getState();
        this.setState({dashboard:configStorteState.dashboard});
      });
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

  save() {
    this.setState({ shouldSave: true });
  }

  doneSaving() {
    this.setState({ shouldSave: false });
  }
  
  onSettingsButtonClicked() {
    this.setState({ showSettingsDialog: true });
  }

  onSettingsDialogSaveClick() {
      this.save();
  }

  onSettingsDialogCancelClick() {
    this.setState({ showSettingsDialog: false });
  }

  onChildSaveCompleted() {
    this.setState({ showSettingsDialog: false, shouldSave: false });
    this.props.onUpdateLayout();
  }

  onConfigDialogViewChange(newValue, newActiveIndex, event){
    this.setState({activeConfigView: newValue});
  }

  ///Display component based on user selection from dropdown menue
  chooseComponentToDisplay() {
    let { shouldSave } = this.state;
    var elementsSettings:IElementsContainer = this.state.dashboard;

    switch(this.state.activeConfigView){

      case this.ConfigurationViews.ApplicationInsights:{
        return (<Config standaloneView={false} shouldSave={shouldSave} />)
      }
      
      case this.ConfigurationViews.DataSources: {
        return (
          <ElementsSettings ElementsSettings={elementsSettings} shouldSave={shouldSave}  />
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

    let { shouldSave,showSettingsDialog } = this.state;
    const titleMenu = (
      <SelectField
        key="titleMenu"
        id="titles"
        menuItems={[this.ConfigurationViews.ApplicationInsights,this.ConfigurationViews.DataSources,this.ConfigurationViews.Elements ,this.ConfigurationViews.Filters]}
        defaultValue={this.ConfigurationViews.ApplicationInsights}
        onChange={this.onConfigDialogViewChange}
      />);

    return (
        <span>
            <Button key="settings" icon tooltipLabel="Connections" onClick={this.onSettingsButtonClicked}>settings_applications</Button>
            <Dialog
                    id="settingsForm"
                    visible={showSettingsDialog}
                    modal
                    dialogStyle={{ width:'90%', height:'90%'}}
                    contentStyle={{minHeight:500}}
                    className='dialog-toolbar-no-padding'
                    actions={[
                        { onClick: this.onSettingsDialogSaveClick, primary: true, label: 'Save', },
                        { onClick: this.onSettingsDialogCancelClick, primary: false, label: 'Cancel' }
                    ]}
                    >
                    <Toolbar colored title="Dashboard Configuration" titleMenu={titleMenu} />
                    {this.chooseComponentToDisplay()}
            </Dialog>  
      </span>
    );
  }
}