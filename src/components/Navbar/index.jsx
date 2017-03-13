Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var NavigationDrawers_1 = require("react-md/lib/NavigationDrawers");
var FontIcons_1 = require("react-md/lib/FontIcons");
var ListItem_1 = require("react-md/lib/Lists/ListItem");
var Avatars_1 = require("react-md/lib/Avatars");
var SelectFields_1 = require("react-md/lib/SelectFields");
var react_router_1 = require("react-router");
require("./style.css");
var avatarSrc = 'https://cloud.githubusercontent.com/assets/13041/19686250/971bf7f8-9ac0-11e6-975c-188defd82df1.png';
var drawerHeaderChildren = [
    <Avatars_1.default key={avatarSrc} src={avatarSrc} role='presentation' iconSized style={{ alignSelf: 'center', marginLeft: 16, marginRight: 16, flexShrink: 0 }}/>,
    <SelectFields_1.default id='account-switcher' defaultValue='Jonathan' menuItems={['Jonathan', 'Fred']} key='account-switcher' position={SelectFields_1.default.Positions.BELOW} className='md-select-field--toolbar'/>
];
exports.default = function (_a) {
    var _b = _a.children, children = _b === void 0 ? null : _b, _c = _a.title, title = _c === void 0 ? 'Bot Framework Dashboard' : _c;
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
