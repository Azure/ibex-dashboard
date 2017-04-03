import * as React from 'react';

import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import FontIcon from 'react-md/lib/FontIcons';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';
import SelectField from 'react-md/lib/SelectFields';
import NavigationLink from './NavigationLink';
import { Link } from 'react-router';
import Chip from 'react-md/lib/Chips';

import AccountStore from '../../stores/AccountStore';
import AccountActions from '../../actions/AccountActions';

import './style.css';

const avatarSrc = 'https://cloud.githubusercontent.com/assets/13041/19686250/971bf7f8-9ac0-11e6-975c-188defd82df1.png';

const drawerHeaderChildren = [
  (
    <Avatar
      key={avatarSrc}
      src={avatarSrc}
      role="presentation"
      iconSized={true}
      style={{ alignSelf: 'center', marginLeft: 16, marginRight: 16, flexShrink: 0 }}
    />
  ),
  (
    <SelectField
      id="account-switcher"
      defaultValue="Jonathan"
      menuItems={['Jonathan', 'Fred']}
      key="account-switcher"
      position={SelectField.Positions.BELOW}
      className="md-select-field--toolbar"
    />
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
  }

  render() {
    let { children, title } = this.props;
    let pathname = '/';
    try { pathname = window.location.pathname; } catch (e) { }

    let navigationItems = [
      (
        <ListItem
          key="0"
          component={Link}
          href="/"
          active={pathname === '/'}
          leftIcon={<FontIcon>home</FontIcon>}
          tileClassName="md-list-tile--mini"
          primaryText={'Home'}
        />
      ),
      (
        <ListItem
          key="1"
          component={Link}
          href="/about"
          active={pathname === '/about'}
          leftIcon={<FontIcon>info</FontIcon>}
          tileClassName="md-list-tile--mini"
          primaryText={'About'}
        />
      ),
      (
        <ListItem
          key="2"
          component={Link}
          href="/dashboard"
          active={pathname === '/dashboard'}
          leftIcon={<FontIcon>dashboard</FontIcon>}
          tileClassName="md-list-tile--mini"
          primaryText={'Dashboard'}
        />
      ),
      (
        <ListItem
          key="3"
          component={Link}
          href="/setup"
          active={pathname === '/setup'}
          leftIcon={<FontIcon>settings</FontIcon>}
          tileClassName="md-list-tile--mini"
          primaryText={'Settings'}
        />
      )
    ];

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
          title = 'About';
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

    return (
      <div>
        <NavigationDrawer
          navItems={navigationItems}
          contentClassName="md-grid"
          drawerHeaderChildren={drawerHeaderChildren}
          mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
          tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
          desktopDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
          toolbarTitle={title}
          toolbarActions={toolbarActions}
        >
          {children}
        </NavigationDrawer>
      </div>
    );
  }
}