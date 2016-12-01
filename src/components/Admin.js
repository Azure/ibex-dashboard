import React from 'react';
import Fluxxor from 'fluxxor';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactTable from 'react-table'


const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

export const Admin = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    displayName: 'Admin',


    componentWillReceiveProps: function(nextProps) {
        console.log("Admin.componentWillReceiveProps")
        this.setState(this.getStateFromFlux());
    },

    componentWillMount: function() {
        this.getFlux().actions.ADMIN.load_keywords();
        this.getFlux().actions.ADMIN.load_fb_pages();
        this.getFlux().actions.ADMIN.get_language();
        this.getFlux().actions.ADMIN.get_target_region();
        this.getFlux().actions.ADMIN.load_localities();
    },

    getStateFromFlux: function() {
        console.log("getStateFromFlux", this.getFlux().store("AdminStore").getState());
        return this.getFlux().store("AdminStore").getState();
    },

    handleTabChanged: function() {

    },

    render() {
        return (
            <div className="admin">
                <Tabs
                    onSelect={this.handleTabChanged}
                    selectedIndex={1}>
                    <TabList>
                        <Tab>Language</Tab>
                        <Tab>Facebook pages</Tab>
                        <Tab>Search keywords</Tab>
                        <Tab>Target region</Tab>
                        <Tab>Localities</Tab>
                        <Tab>Blacklisted Term(s)</Tab>
                        <Tab>Portal Sites</Tab>
                    </TabList>

                    <TabPanel>
                        <h2>Language</h2>
                        <h3> {this.state.settings.language}</h3>

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
                        <h2>Search keywords</h2>

                        <div className="adminTable">
                            <ReactTable
                                data={this.state.settings.keywords}
                                columns={[{  header: 'en_term', accessor: 'name' }]}
                                pageSize='10'
                                />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h2>Target region</h2>

                          <h3> {this.state.settings.targetRegion}</h3>

                    </TabPanel>
                    <TabPanel>
                        <h2>Localities</h2>

                        <div className="adminTable">
                            <ReactTable
                                data={this.state.settings.localities}
                                columns={[{  header: 'name', accessor: 'name' }, {  header: 'coordinates', accessor: 'coordinates' }]}
                                pageSize='10'
                                />
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

        )
    }
});