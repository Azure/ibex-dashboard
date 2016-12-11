import React from 'react';
import Fluxxor from 'fluxxor';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactTable from 'react-table'
import {AdminSiteList} from './AdminSiteList';
import {AdminSettings} from './AdminSettings';
import {AdminWatchlist} from './AdminWatchlist';
import {CustomEventsEditor} from './CustomEventsEditor';
import {AdminTwitterAccounts} from './AdminTwitterAccounts';
import '../styles/Admin.css'

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");
const SETTINGS_TAB = 0, WATCHLIST_TAB = 1, CUSTOM_EVENTS_TAB = 3, TWITTER_ACCOUNTS_TAB = 5;
const styles = {
    container: {
        panel: {
            marginTop: '6px'
        },
        panelHeading: {
            paddingTop: '3px',
            paddingBottom: '3px'
        }
    }
};

export const Admin = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],
    displayName: 'Admin',
    
    getInitialState(){
        return{
            index: 0
        }
    },

    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },

    handleTabChanged(index, last){
        this.setState({index});
    },

    render() {
        return (
         <div className="container-fluid">
             <div className="col-lg-12">
                <div className="panel panel-primary" style={styles.container.panel}>
                    <div className="panel-heading" style={styles.container.panelHeading}>
                        <AdminSiteList {...this.props} />
                    </div>
                    <div className="panel-body">
                        <div className="row adminContainer">
                                <Tabs
                                    onSelect={this.handleTabChanged}
                                    selectedIndex={this.state.index}>
                                    <TabList>
                                        <Tab>Site Settings</Tab>
                                        <Tab>Watchlist</Tab>
                                        <Tab>Monitored Areas</Tab>
                                        <Tab>Event Import</Tab>
                                        <Tab>Facebook pages</Tab>
                                        <Tab>Twitter API Accounts</Tab>
                                        <Tab>Blacklisted Term(s)</Tab>
                                    </TabList>
                                    <TabPanel>
                                        <h2>Settings</h2>
                                        {
                                            this.state.settings && this.state.settings.properties && this.state.index === SETTINGS_TAB? 
                                              <AdminSettings {...this.props}
                                                        index={this.state.index}
                                                        siteSettings={this.state.settings}
                                                         />
                                            : undefined
                                        }
                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Watchlist</h2>
                                          <div className="adminTable">
                                            {
                                                this.state.settings && this.state.settings.properties && this.state.watchlist && this.state.index === WATCHLIST_TAB ? 
                                                    <AdminWatchlist {...this.props}/> : undefined
                                            }
                                          </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Monitored Locations</h2>
                                        <div className="adminTable">
                                            <ReactTable
                                                data={this.state.settings.localities}
                                                columns={[{  header: 'Location Name', accessor: 'name' }, {  header: 'coordinates', accessor: 'coordinates' }]}
                                                pageSize='10'
                                                />
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Event Import</h2>
                                        <div className="adminTable">
                                        {
                                             this.state.settings && this.state.settings.properties && this.state.index === CUSTOM_EVENTS_TAB ? 
                                                    <CustomEventsEditor {...this.props}/> : undefined
                                        }
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Facebook pages</h2>
                                        <div className="adminTable">
                                            <ReactTable
                                                data={this.state.settings.fbPages}
                                                columns={[{  header: 'URL', accessor: 'url' }]}
                                                pageSize='10'
                                                />
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Twitter API Accounts</h2>
                                        <div>
                                        {
                                             this.state.settings && this.state.settings.properties && this.state.index === TWITTER_ACCOUNTS_TAB ? 
                                                    <AdminTwitterAccounts {...this.props}/> : undefined
                                        }
                                        </div>

                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Blacklisted Term(s)</h2>
                                        <div className="adminTable">
                                            <ReactTable
                                                data={this.state.settings.localities}
                                                columns={[{  header: 'name', accessor: 'name' }, {  header: 'coordinates', accessor: 'coordinates' }]}
                                                pageSize='10'
                                                />
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
});