import * as React from 'react';

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

import AccountStore from '../../stores/AccountStore';
import AccountActions from '../../actions/AccountActions';

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
  }

  render() {
    let { dashboards } = this.state;
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

    if (!title) {
      switch (window.location.pathname) {
        case '/':
          title = 'Create Dashboard';
          break;

        case '/about':
          title = 'Help';
          break;

        case '/dashboard':
          title = 'Dashboard';
          break;

        case '/dashboard/config':
          title = 'Dashboard Configuration';
          break;

        case '/setup':
          title = 'Setup Authentication';
          break;

        default:

          title = 'Ibex Dashboard';
          break;
      }
    }

    const drawerType = navigationItems.length > 0 ?
      NavigationDrawer.DrawerTypes.TEMPORARY_MINI : NavigationDrawer.DrawerTypes.TEMPORARY;

    const toolbarActions = (
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
          primaryText="Create Dashboard"
          href="/"
          active={pathname === '/'}
          component={Link}
          leftIcon={<FontIcon>add_box</FontIcon>}
        />
        <ListItem
          primaryText="Setup Authentication"
          href="/setup"
          active={pathname === '/setup'}
          component={Link}
          leftIcon={<FontIcon>lock</FontIcon>}
        />
      </MenuButton>
    );

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
              <Toolbar title={title} actions={toolbarActions} colored />
              <div className="md-grid">
                {children}
              </div>
            </div>
          )}
      </div>
    );
  }
}