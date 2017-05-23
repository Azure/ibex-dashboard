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
import SettingsStore, { ISettingsStoreState } from '../../stores/SettingsStore';
import SettingsActions from '../../actions/SettingsActions';
import ElementsSettings from './Elements/ElementsSettings';
import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';

interface ISettingsButtonState {
  showSettingsDialog: boolean;
  activeConfigView: string;
  dashboard?: IDashboardConfig;
}

interface ISettingsButtonProps {
  children?: any;
  onUpdateLayout: any;
}

const VIEWS = {
  ApplicationConnections: 'Application Connections',
  Elements: 'Elements',
  DataSources: 'Data Sources',
  Filters: 'Filters'
};

export default class SettingsButton extends React.Component<ISettingsButtonProps, ISettingsButtonState> {

  state: ISettingsButtonState = {
    showSettingsDialog: false,
    activeConfigView: VIEWS.ApplicationConnections,
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

    // initialize the dashboard state
    let configStorteState = ConfigurationsStore.getState();

    // never work on the original object, to allow cancel.
    let clonedDashboard = _.cloneDeep(configStorteState.dashboard);
    this.state.dashboard = clonedDashboard;
  }

  componentDidMount() {
    SettingsStore.listen(this.onStoreChange);
  }
  
  componentWillUnmount() {
    SettingsStore.unlisten(this.onStoreChange);
  }

  onStoreChange(state: ISettingsStoreState) {

    if (!state.isSavingSettings) {
      // since we are passing parts of dashbaord by ref, and the cild elements 
      // just completed to update the data into it, we can safly save it with all the new changes.
      let { dashboard } = this.state;

      setTimeout(
        () => {
          ConfigurationsActions.saveConfiguration(dashboard);
          this.onChildSaveCompleted();
        },
        100);
    }
  }

  onSettingsButtonClicked() {
    this.setState({ showSettingsDialog: true });
  }

  onSettingsDialogSaveClick() {
    let { dashboard } = this.state;

    setTimeout(
      () => {
        ConfigurationsActions.saveConfiguration(dashboard);
        ConfigurationsActions.loadConfiguration();
        ConfigurationsActions.loadDashboard(dashboard.id);
        this.setState({ showSettingsDialog: false});
      },
      100
    );
  }

  onSettingsDialogCancelClick() {
    this.setState({ showSettingsDialog: false });
  }

  onChildSaveCompleted() {
  }

  onConfigDialogViewChange(newValue: string, newActiveIndex: number, event: UIEvent) {
    this.setState({ activeConfigView: newValue });
  }

  ///Display component based on user selection from dropdown menue
  chooseComponentToDisplay() {
    
    let elementsSettings: IElementsContainer = this.state.dashboard;
    let { activeConfigView } = this.state;

    switch (activeConfigView) {

      case VIEWS.ApplicationConnections:
        let configuration = ConfigurationsStore.getState();
        return (
          <Config standaloneView={false} dashbaord={configuration.dashboard} connections={configuration.connections} />
        );
      
      case VIEWS.DataSources:
        return <ElementsSettings ElementsSettings={elementsSettings} />;
      
      default:
        return <h1>{this.state.activeConfigView} - is not implemented yet</h1>;
    }
  }

  render() {
    let { dashboard, showSettingsDialog } = this.state;
    var elementsSettings: IElementsContainer = this.state.dashboard;

    const titleMenu = (
      <SelectField
        key="titleMenu"
        id="titles"
        menuItems={[ VIEWS.ApplicationConnections, VIEWS.DataSources, VIEWS.Elements , VIEWS.Filters ]}
        defaultValue={VIEWS.ApplicationConnections}
        onChange={this.onConfigDialogViewChange}
      />
    );

    return (
      <span>
        <Button key="settings" icon tooltipLabel="Connections" onClick={this.onSettingsButtonClicked}>
          settings_applications
        </Button>
        <Dialog
          id="settingsForm"
          visible={showSettingsDialog}
          dialogStyle={{ width: '90%', height: '90%', 'overflow-y': 'auto' }}
          className="dialog-toolbar-no-padding"
          modal
          actions={[
            { onClick: this.onSettingsDialogSaveClick, primary: true, label: 'Save', },
            { onClick: this.onSettingsDialogCancelClick, primary: false, label: 'Cancel' }
          ]}
        >
          <TabsContainer colored panelClassName="md-grid">
            <Tabs tabId="settings-tabs">
              <Tab label={VIEWS.ApplicationConnections}>
                <div className="md-cell md-cell--6">
                  <Config 
                    standaloneView={false} 
                    dashboardId={dashboard.id} 
                    connections={dashboard.config.connections} 
                  />
                </div>
              </Tab>
              <Tab label={VIEWS.Elements}>
                <ElementsSettings ElementsSettings={elementsSettings} />
              </Tab>
              <Tab label={VIEWS.DataSources}>
                <h1>{VIEWS.DataSources} - is not implemented yet</h1>
              </Tab>
              <Tab label={VIEWS.Filters}>
                <h1>{VIEWS.Filters} - is not implemented yet</h1>
              </Tab>
            </Tabs>
          </TabsContainer>
        </Dialog>  
      </span>
    );
  }
}