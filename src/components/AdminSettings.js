import React from 'react';
import Fluxxor from 'fluxxor';
import '../styles/Admin.css'

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

const styles = {
    settings: {
            input: {
                width: '30%'
            },
            container: {
                display: 'flex'
            },
            label:{
                fontWeight: 500,
                color: '#3f3f4f',
                margin: '0 0 2px'
            },
            buttonRow: {
                marginTop: '20px'
            },
            labelInfo: {
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#000'
            }
    }
};

export const AdminSettings = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return{
            "validForm": false,
            "siteSettings": {},
            "localAction": false
        }
    },

    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },

    componentWillReceiveProps(nextProps){
        const {siteSettings} = nextProps;

        this.setState({siteSettings});
    },

    componentDidMount(){
        const {siteSettings} = this.props;

        this.setState({siteSettings});
    },

    handleSaveSettings(){
        const {targetBbox, defaultLocation, defaultZoomLevel} = this.props.siteSettings.properties;
        const {name, storageConnectionString, title, logo, fbToken, featuresConnectionString, supportedLanguages} = this.refs;
        const languageArray = supportedLanguages.value.split(",");
        const languageJSON = `["${languageArray.join('","')}"]`;
        const siteDefintion = {name: name.value, targetBbox: targetBbox, logo:logo.value, defaultLocation:defaultLocation, 
                               defaultZoomLevel:defaultZoomLevel, supportedLanguages: JSON.parse(languageJSON), 
                               title:title.value, featuresConnectionString:featuresConnectionString.value, 
                               storageConnectionString:storageConnectionString.value, fbToken:fbToken.value};

        this.getFlux().actions.ADMIN.save_settings(this.props.siteKey, siteDefintion);
    },

    handleChange(event){
        const {settingsForm} = this.refs;
        let siteSettingsMutable = this.state.siteSettings;
        let fieldName = event.target.name;

        if(fieldName === "name"){
            siteSettingsMutable.name = event.target.value;
        }else{
            siteSettingsMutable.properties[fieldName] = event.target.value;
        }
        
        this.setState({validForm: settingsForm && settingsForm.checkValidity() && this.refs.name && this.refs.name.value.indexOf(" ") === -1,
                       siteSettings: siteSettingsMutable,
                       localAction: false });
    },

    render(){
        let changesSaved = this.state.action === "Saved";

        return (
          this.state.siteSettings.properties ? 
            <div className="row">
                <form ref="settingsForm">
                    <div className="col-lg-10">
                        <div className="form-group">
                            <label htmlFor="siteName">Site Name<span>*</span></label>
                            <input readOnly onChange={this.handleChange} required aria-required="true" data-rule="required" name="name" data-msg="Please enter a site name" ref="name" value={this.state.siteSettings.name} type="text" style={styles.settings.input} className="form-control settings" aria-label="siteName" />
                            <div className="validation"></div>
                        </div>
                        <div className="form-group">
                            <label>Site Title<span>*</span></label>
                            <input onChange={this.handleChange} required data-rule="required" data-msg="Please enter a site title" name="title" ref="title" value={this.state.siteSettings.properties.title} type="text" style={styles.settings.input} className="form-control settings" aria-label="..." />
                            <div className="validation"></div>
                        </div>
                        <div className="form-group">
                            <label>Header Logo Banner<span>*</span></label>
                            <input onChange={this.handleChange} required data-rule="required" data-msg="Please enter a header image for your site" name="logo" ref="logo" value={this.state.siteSettings.properties.logo} type="text" style={styles.settings.input} className="form-control settings" aria-label="..." />
                            <div className="validation"></div>
                        </div>
                        <div className="form-group">
                            <label>Azure Storage Connection String<span>*</span></label>
                            <input onChange={this.handleChange} required name="storageConnectionString" ref="storageConnectionString" data-rule="required" data-msg="Please enter a storageConnectionString" value={this.state.siteSettings.properties.storageConnectionString} type="text" style={styles.settings.input} className="form-control settings" aria-label="..." />
                            <div className="validation"></div>
                        </div>
                        <div className="form-group">
                            <label>Postgres Storage Connection String<span>*</span></label>
                            <input onChange={this.handleChange} required name="featuresConnectionString" ref="featuresConnectionString" value={this.state.siteSettings.properties.featuresConnectionString} type="text" style={styles.settings.input} className="form-control settings" aria-label="..." />
                            <div className="validation"></div>
                        </div>
                        <div className="form-group">
                            <label>Supported Languages(<span style={styles.settings.labelInfo}>comma seperated i.e. en,ar</span>)<span>*</span></label>
                            <input onChange={this.handleChange} required name="supportedLanguages" ref="supportedLanguages" value={this.state.siteSettings.properties.supportedLanguages} type="text" style={styles.settings.input} className="form-control settings" aria-label="..." />
                            <div className="validation"></div>
                        </div>
                        <div className="form-group">
                            <label>Facebook Graph API Access Token<span>*</span></label>
                            <input onChange={this.handleChange} required name="fbToken" ref="fbToken" value={this.state.siteSettings.properties.fbToken} type="text" style={styles.settings.input} className="form-control settings" aria-label="..." />
                            <div className="validation"></div>
                        </div>
                        <div className="form-group">
                            <p style={styles.settings.buttonRow}>
                            {
                                this.state.validForm ? 
                                    <button onClick={this.handleSaveSettings} type="button" className={!changesSaved ? `btn btn-primary btn-sm addSiteButton` : `btn btn-success btn-sm addSiteButton`}>
                                                <i className="fa fa-cloud-upload" aria-hidden="true"></i> {changesSaved ? "Saved Changes" : "Save Settings"}
                                    </button>
                                : undefined
                            }  
                            </p>
                        </div>
                    </div>
                </form>
            </div>
            : <div />
        );
    }
});