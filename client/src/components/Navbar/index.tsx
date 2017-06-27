import * as React from 'react';

import TextField from 'react-md/lib/TextFields';
import Dialog from 'react-md/lib/Dialogs';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Toolbar from 'react-md/lib/Toolbars';
import FontIcon from 'react-md/lib/FontIcons';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';
import SelectField from 'react-md/lib/SelectFields';
import NavigationLink from './NavigationLink';
import { Link } from 'react-router';
import Chip from 'react-md/lib/Chips';
import Menu from 'react-md/lib/Menus/Menu';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import Button from 'react-md/lib/Buttons';
import FileUpload from 'react-md/lib/FileInputs/FileUpload';

import AccountStore from '../../stores/AccountStore';
import AccountActions from '../../actions/AccountActions';

import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';

import './style.css';

const drawerHeaderChildren = [
  (
    <div key={0} style={{ alignSelf: 'center', marginLeft: 16, marginRight: 16, flexShrink: 0 }}>
      <h3>Ibex Dashboard</h3>
    </div>
  )
];

export default class Navbar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = AccountStore.getState();
    AccountStore.listen((state) => {
      this.setState(state);
    });
    AccountActions.updateAccount();

    ConfigurationsStore.listen((state) => {
      this.setState({
        dashboards: state.dashboards
      });
    });

    // import dashboard functionality
    this.onOpenInfo = this.onOpenInfo.bind(this);
    this.onCloseInfo = this.onCloseInfo.bind(this);
    this.onSubmitImport = this.onSubmitImport.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.setFile = this.setFile.bind(this);
  }

  componentDidMount() {
    // Checking if running locally and authentication is activated
    // This is a mitigation that handles authentication in local environment
    // that relies on two ports and redirections.
    if (window.location.port === '3000' && window.location.hostname === 'localhost') {
      setTimeout(
        () => {
          if (!window['dashboardTemplates']) {
            this.setState({ noTemplates: true });
          }
        },
        5000
      );
    }
  }

  onOpenInfo(html: string) {
    this.setState({ importVisible: true });
  }

  onCloseInfo() {
    this.setState({ importVisible: false });
  }

  updateFileName = (value) => {
    this.setState({ fileName: value });
  };

  onLoad(file, uploadResult) {
    const { name, size, type, lastModifiedDate } = file;
    this.setState({ fileName: name.substr(0, name.indexOf('.')), content: uploadResult });
  }

  onSubmitImport() {
    var dashboardId = this.state.fileName
    ConfigurationsActions.submitDashboardFile(this.state.content, dashboardId);
    
    this.setState({ importVisible: false });
  }

  setFile(file) {
    this.setState({ file });
  }

  render() {
    let { dashboards, noTemplates } = this.state;
    let { importVisible } = this.state;
    let { file, fileName } = this.state;

    let { children, title } = this.props;
    let pathname = '/';
    try { pathname = window.location.pathname; } catch (e) { }

    let navigationItems = [];
    let toolbarTitle = null;

    (dashboards || []).forEach((dashboard, index) => {
      let name = dashboard.name || null;
      let url = '/dashboard/' + (dashboard.url || index.toString());
      let active = pathname === url;
      if (!title && active && name) {
        title = name;
        toolbarTitle = !dashboard.logo ? name : (
          <span>
            <span className="title-logo"><img src={dashboard.logo} /></span>
            <span>{name}</span>
          </span>
        );
      }

      navigationItems.push(
        (
          <ListItem
            key={index + 4}
            component={Link}
            href={url}
            active={active}
            leftIcon={<FontIcon>{dashboard.icon || 'dashboard'}</FontIcon>}
            tileClassName="md-list-tile--mini"
            primaryText={name || 'Dashboard'}
          />
        )
      );
    });

    if (!toolbarTitle) {
      switch (window.location.pathname) {
        case '/':
          toolbarTitle = 'Create Dashboard';
          break;

        case '/about':
          toolbarTitle = 'Help';
          break;

        case '/dashboard':
          toolbarTitle = 'Dashboard';
          break;

        case '/dashboard/config':
          toolbarTitle = 'Dashboard Configuration';
          break;

        case '/setup':
          toolbarTitle = 'Setup Authentication';
          break;

        default:

          toolbarTitle = 'Ibex Dashboard';
          break;
      }
    }

    const drawerType = navigationItems.length > 0 ?
      NavigationDrawer.DrawerTypes.TEMPORARY_MINI : NavigationDrawer.DrawerTypes.TEMPORARY;

    const toolbarActions = [(
      <Button
        icon
        tooltipLabel="Create Dashboard"
        href="/"
        component={Link}
      >add_box
      </Button>),
    (
      <Button
        icon
        tooltipLabel="Import dashboard"
        onClick={this.onOpenInfo.bind(this)}
        component={Link}
      >add_box
      </Button>),
    <Dialog
      id="ImportDashboard"
      visible={importVisible}
      title="Import dashboard"
      dialogStyle={{ width: '50%' }}
      modal
      actions={[
        { onClick: this.onCloseInfo, primary: false, label: 'Cancel' },
        { onClick: this.onSubmitImport, primary: true, label: 'Submit', disabled: !file },
      ]}
    >
      <FileUpload
        id="dashboardDefenitionFile"
        primary
        label="Choose File"
        accept="application/json"
        onLoadStart={this.setFile}
        onLoad={this.onLoad}
      />
      <TextField
        id="dashboardFileName"
        label="Dashboard ID"
        value={fileName}
        onChange={this.updateFileName}
        disabled={!file}
        lineDirection="center"
        placeholder="Choose an ID for the imported dashboard"
      />
    </Dialog>
      , (
      <MenuButton
        id="vert-menu"
        icon
        buttonChildren="more_vert"
        position={Menu.Positions.BOTTOM_RIGHT}
      >
        {
          this.state.account ? (
            <ListItem
              primaryText={this.state.account.displayName}
              leftAvatar={<Avatar>this.state.account.displayName.charAt(0).toUpperCase()</Avatar>}
              disabled
            />
          ) : (
              <ListItem
                primaryText="Anon"
                leftAvatar={<Avatar icon={<FontIcon>perm_identity</FontIcon>} />}
                disabled
              />
            )
        }
        <ListItem
          primaryText="Setup Authentication"
          href="/setup"
          active={pathname === '/setup'}
          component={Link}
          leftIcon={<FontIcon>lock</FontIcon>}
        />
      </MenuButton>
    )];

    if (noTemplates && !dashboards && window.location.pathname !== '/setup') {
      children = (
        <div>
          <h1>There's seems to be a problem</h1>
          <span>If you are running locally, ensure to first open </span>
          <a target="_blank" href="http://localhost:4000">http://localhost:4000</a>
          <span> and then </span>
          <a href="http://localhost:3000">http://localhost:3000</a>.
        </div>
      );
    }

    return (
      <div>
        {navigationItems.length > 0 ? (
          <NavigationDrawer
            navItems={navigationItems}
            contentClassName="md-grid"
            drawerHeaderChildren={drawerHeaderChildren}
            mobileDrawerType={drawerType}
            tabletDrawerType={drawerType}
            desktopDrawerType={drawerType}
            toolbarTitle={toolbarTitle}
            toolbarActions={toolbarActions}
          >
            {children}
          </NavigationDrawer>
        ) : (
            <div>
              <Toolbar title={toolbarTitle} actions={toolbarActions} colored />
              <div className="md-grid">
                {children}
              </div>
            </div>
          )}
      </div>
    );
  }
}