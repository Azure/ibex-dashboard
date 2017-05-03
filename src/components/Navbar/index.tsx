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

const avatarSrc = 'https://cloud.githubusercontent.com/assets/13041/19686250/971bf7f8-9ac0-11e6-975c-188defd82df1.png';

const drawerHeaderChildren = [];

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

    (dashboards || []).forEach((dashboard, index) => {
      let name = dashboard.name || null;
      let url = '/dashboard/' + (dashboard.url || index.toString());
      let active = pathname === url;
      if (!title && active && name) {
        title = name;
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
    
    let toolbarActions = 
        this.state.account ?
          <Chip style={{ marginRight: 30 }} label={'Hello, ' + this.state.account.displayName} /> :
          null;

    if (!title) {
      switch (window.location.pathname) {
        case '/':
          title = 'Home';
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
          title = 'Setup Dashboard';
          break;

        default:

          title = 'Ibex Dashboard';
          break;
      }
    }

    const drawerType = navigationItems.length > 0 ? 
      NavigationDrawer.DrawerTypes.TEMPORARY_MINI : NavigationDrawer.DrawerTypes.TEMPORARY;

    const moreButtonMenu = (
      <MenuButton
        id="vert-menu"
        icon
        buttonChildren="more_vert"
        position={Menu.Positions.BOTTOM_RIGHT}
      >
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
          toolbarTitle={title}
          toolbarActions={moreButtonMenu}
        >
          {children}
        </NavigationDrawer>
        ) : (
          <div>
            <Toolbar title={title} actions={moreButtonMenu} colored />
            <div className="md-grid">
              {children}
            </div>
        </div>
        )}
      </div>
    );
  }
}