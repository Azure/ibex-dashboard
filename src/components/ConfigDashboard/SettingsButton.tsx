import * as React from 'react';
import * as _ from 'lodash';

import Button from 'react-md/lib/Buttons/Button';
import Toolbar from 'react-md/lib/Toolbars';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';
import SelectField from 'react-md/lib/SelectFields';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import FontIcon from 'react-md/lib/FontIcons';

import { ToastActions } from '../Toast';

import ConfigDashboard from './ConfigDashboard';
import SettingsStore, { ISettingsStoreState } from '../../stores/SettingsStore';
import SettingsActions from '../../actions/SettingsActions';
import ElementsSettings from './Elements/ElementsSettings';
import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore, { IConfigurationsStoreState } from '../../stores/ConfigurationsStore';

interface ISettingsButtonState {
  showSettingsDialog: boolean;
  activeView: string;
  dashboard?: IDashboardConfig;
}

interface ISettingsButtonProps {
  children?: any;
  onUpdateLayout: any;
}

const VIEWS = {
  Connections: 'Application Connections',
  Elements: 'Elements',
  DataSources: 'Data Sources',
  Filters: 'Filters'
};

export default class SettingsButton extends React.Component<ISettingsButtonProps, ISettingsButtonState> {

  state: ISettingsButtonState = {
    showSettingsDialog: false,
    activeView: VIEWS.Connections,
    dashboard: null
  };

  constructor(props: ISettingsButtonProps) {
    super(props);

    this.onSettingsButtonClicked = this.onSettingsButtonClicked.bind(this);
    this.onSettingsDialogSaveClick = this.onSettingsDialogSaveClick.bind(this);
    this.onSettingsDialogCancelClick = this.onSettingsDialogCancelClick.bind(this);
    this.onSettingsStoreChange = this.onSettingsStoreChange.bind(this);
    this.onConfigurationChange = this.onConfigurationChange.bind(this);
    this.onSelectView = this.onSelectView.bind(this);
  }

  componentDidMount() {
    SettingsStore.listen(this.onSettingsStoreChange);

    this.onConfigurationChange(ConfigurationsStore.getState());
    ConfigurationsStore.listen(this.onConfigurationChange);
  }
  
  componentWillUnmount() {
    SettingsStore.unlisten(this.onSettingsStoreChange);
    ConfigurationsStore.unlisten(this.onConfigurationChange);
  }

  onConfigurationChange(state: IConfigurationsStoreState) {

    if (!this.state.dashboard) {
      let { dashboard } = state;
      
      // Clone the dashboard to enable canceling changes
      let clonedDashboard = _.cloneDeep(dashboard);
      
      this.setState({ dashboard: clonedDashboard });
    }
  }

  onSettingsStoreChange(state: ISettingsStoreState) {

    if (!state.isSavingSettings) {
      // since we are passing parts of dashbaord by ref, and the cild elements 
      // just completed to update the data into it, we can safly save it with all the new changes.
      let { dashboard } = this.state;

      setTimeout(
        () => {
          ConfigurationsActions.saveConfiguration(dashboard);
        },
        100);
    }
  }

  onSettingsButtonClicked() {
    this.setState({ showSettingsDialog: true });
  }

  onSettingsDialogSaveClick() {
    let { dashboard } = this.state;

    ConfigurationsActions.saveConfiguration(dashboard);
    ConfigurationsActions.loadConfiguration();
    ConfigurationsActions.loadDashboard(dashboard.id);
    this.setState({ showSettingsDialog: false});
  }

  onSettingsDialogCancelClick() {
    this.setState({ showSettingsDialog: false });
  }

  onSelectView(viewName: string) {
    this.setState({ activeView: viewName });
  }

  render() {
    let { dashboard, showSettingsDialog } = this.state;

    if (!dashboard) { return null; }

    if (!dashboard.config || !dashboard.config.connections) {
      ToastActions.showText('Dashboard configuration is invalid');
      return null;
    }
    
    const titleMenu = (
      <SelectField
        key="titleMenu"
        id="titles"
        menuItems={[ VIEWS.Connections, VIEWS.DataSources, VIEWS.Elements , VIEWS.Filters ]}
        defaultValue={VIEWS.Connections}
        onChange={this.onSelectView}
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
          dialogStyle={{ width: '90%', height: '90%', overflowY: 'auto' }}
          className="dialog-toolbar-no-padding"
          modal
          actions={[
            { onClick: this.onSettingsDialogSaveClick, primary: true, label: 'Save', },
            { onClick: this.onSettingsDialogCancelClick, primary: false, label: 'Cancel' }
          ]}
        >
          <TabsContainer colored panelClassName="md-grid">
            <Tabs tabId="settings-tabs">
              <Tab label={VIEWS.Connections}>
                <div className="md-cell md-cell--6">
                  <ConfigDashboard 
                    connections={dashboard.config.connections} 
                    standaloneView={false}  
                  />          
                </div>
              </Tab>
              <Tab label={VIEWS.Elements}>
                <ElementsSettings ElementsSettings={dashboard} />
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