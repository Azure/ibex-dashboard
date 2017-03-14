Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const NavigationDrawers_1 = require("react-md/lib/NavigationDrawers");
const FontIcons_1 = require("react-md/lib/FontIcons");
const ListItem_1 = require("react-md/lib/Lists/ListItem");
const Avatars_1 = require("react-md/lib/Avatars");
const SelectFields_1 = require("react-md/lib/SelectFields");
const react_router_1 = require("react-router");
require("./style.css");
const avatarSrc = 'https://cloud.githubusercontent.com/assets/13041/19686250/971bf7f8-9ac0-11e6-975c-188defd82df1.png';
const drawerHeaderChildren = [
    <Avatars_1.default key={avatarSrc} src={avatarSrc} role='presentation' iconSized style={{ alignSelf: 'center', marginLeft: 16, marginRight: 16, flexShrink: 0 }}/>,
    <SelectFields_1.default id='account-switcher' defaultValue='Jonathan' menuItems={['Jonathan', 'Fred']} key='account-switcher' position={SelectFields_1.default.Positions.BELOW} className='md-select-field--toolbar'/>
];
exports.default = ({ children = null, title = 'Bot Framework Dashboard' }) => {
    var pathname = '/';
    try {
        pathname = window.location.pathname;
    }
    catch (e) { }
    var navigationItems = [
        <ListItem_1.default key='0' component={react_router_1.Link} href='/' active={pathname == '/'} leftIcon={<FontIcons_1.default>home</FontIcons_1.default>} tileClassName='md-list-tile--mini' primaryText={'Home'}/>,
        <ListItem_1.default key='1' component={react_router_1.Link} href='/about' active={pathname == '/about'} leftIcon={<FontIcons_1.default>info</FontIcons_1.default>} tileClassName='md-list-tile--mini' primaryText={'About'}/>,
        <ListItem_1.default key='2' component={react_router_1.Link} href='/dashboard' active={pathname == '/dashboard'} leftIcon={<FontIcons_1.default>dashboard</FontIcons_1.default>} tileClassName='md-list-tile--mini' primaryText={'Dashboard'}/>
    ];
    return (<div>
      <NavigationDrawers_1.default navItems={navigationItems} contentClassName='md-grid' drawerHeaderChildren={drawerHeaderChildren} mobileDrawerType={NavigationDrawers_1.default.DrawerTypes.TEMPORARY_MINI} tabletDrawerType={NavigationDrawers_1.default.DrawerTypes.TEMPORARY_MINI} desktopDrawerType={NavigationDrawers_1.default.DrawerTypes.TEMPORARY_MINI} toolbarTitle={title} toolbarActions={null}>
        {children}
      </NavigationDrawers_1.default>
    </div>);
};
