import React from 'react';
import Fluxxor from 'fluxxor';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

const styles = {
    newSite: {
            input: {
                width: '12%',
                marginLeft: '10px'
            },
            container: {
                display: 'flex'
            }
    },
    sites: {
        selectField: {
            marginLeft: '10px',
            color: '#fff'
        },
        menuStyle: {
            fontWeight: 700,
            color: 'rgb(46, 189, 89)'
        },
        label:{
            fontWeight: 700
        }
    },
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

export const AdminSiteList = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return{
            "localAction": false
        }
    },
    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },
    handleAddSite() {
        const localAction = "addSite";
        this.setState({localAction});
    },
    handleCancelAddSite() {
        const localAction = false;
        this.setState({localAction});
    },

    handleAddSiteToStorage(){
        const siteName = this.refs.newSiteName.value;
        const siteDefintion = {name: siteName, targetBbox: [], defaultLocation: [], logo: '', title: '', defaultZoomLevel: -1, supportedLanguages: ["en"]};
        this.getFlux().actions.ADMIN.create_site(siteName, siteDefintion);
    },

    handleChange(event, index, value){
        const path = `/site/${value}/admin`;
        this.context.router.push(path);
    },
    render(){
        return (
            !this.state.localAction || this.state.action === "Saved" ? 
                              <div>
                                <span style={styles.sites.label}>Sites:</span>
                                <SelectField style={styles.sites.selectField}
                                            value={this.props.siteKey}
                                            onChange={this.handleChange}
                                            menuStyle={styles.sites.menuStyle}
                                            labelStyle={styles.sites.menuStyle}>
                                    {this.state.siteList.map(site => <MenuItem key={site.name} value={site.name} primaryText={site.name} />)}
                                </SelectField>
                                <button onClick={this.handleAddSite} type="button" className="btn btn-default btn-sm addSiteButton">
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Add Site
                                </button>
                              </div>
                              :
                              <div style={styles.newSite.container}>
                                <span style={styles.sites.label}>New Site Name:</span>
                                <input ref="newSiteName" type="text" style={styles.newSite.input} className="form-control" aria-label="..." />
                                <button onClick={this.handleAddSiteToStorage} type="button" className="btn btn-success btn-sm addSiteButton">
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Create
                                </button>
                                <button onClick={this.handleCancelAddSite} type="button" className="btn btn-danger btn-sm addSiteButton">
                                    <i className="fa fa-remove" aria-hidden="true"></i> Cancel
                                </button>
                              </div>
        );
    }
});