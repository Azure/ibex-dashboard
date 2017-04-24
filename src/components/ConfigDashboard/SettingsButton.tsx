import * as React from 'react';

import Button from 'react-md/lib/Buttons/Button';
import Toolbar from 'react-md/lib/Toolbars';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';
import SelectField from 'react-md/lib/SelectFields';

import Config from '../../pages/Config';
import SettingsStore from '../../stores/SettingsStore';
import SettingsActions from '../../actions/SettingsActions';

interface ISettingsButtonState {
  shouldSave: boolean;
  showSettingsDialog:boolean;
  activeConfigView:string;
}

interface ISettingsButtonProps {
  children?: any;
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
    activeConfigView: this.ConfigurationViews.ApplicationInsights
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
  }

   
  
  componentDidMount() {
      SettingsStore.listen(this.onStoreChange);
  }
  
  componentWillUnmount() {
        SettingsStore.unlisten(this.onStoreChange);
  }

  onStoreChange(state) {
    if(!state.isSavingSettings){
        this.onChildSaveCompleted();
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
    this.setState({ showSettingsDialog: false });
  }

  onConfigDialogViewChange(newValue, newActiveIndex, event){
    this.setState({activeConfigView: newValue});
  }

  ///Display component based on user selection from dropdown menue
  chooseComponentToDisplay() {
    let { shouldSave } = this.state;

    switch(this.state.activeConfigView){
      case this.ConfigurationViews.ApplicationInsights:{
        return (<Config standaloneView={false} shouldSave={shouldSave} />)
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
                    contentStyle={{minHeight:300}}
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