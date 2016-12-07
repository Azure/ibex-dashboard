import React from 'react';
import '../styles/Header.css';
import { Link } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const Header = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
    return {given_name: 'Erik'};  
  },
  
  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  componentWillReceiveProps(nextProps) {
       this.setState(this.getStateFromFlux());
  },

  changeLanguage(event, index, value){
      this.getFlux().actions.DASHBOARD.changeLanguage(value);
  },
  
  render() {
    let siteKey = this.props.siteKey;
    let title = getEnvPropValue(siteKey, process.env.REACT_APP_SITE_TITLE);
    let nav = (siteKey==="dengue") ? this.renderNav() : false ;
    let self = this;

export const Header = React.createClass({  
  render() {
    const title = this.props.siteSettings && this.props.siteSettings.properties ? this.props.siteSettings.properties.title : "";
    const nav = (this.props.siteKey==="dengue") ? this.renderNav() : false ;
    const logo = this.props.siteSettings && this.props.siteSettings.properties ? this.props.siteSettings.properties.logo : false;

    return (
      <nav className="navbar navbar-trans" role="navigation">
          <div>
              <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapsible">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand text-danger" href="#">
                     {
                         logo ? <img role="presentation" src={logo.startsWith("http:") ? logo : `${process.env.PUBLIC_URL}/images/${logo}`} style={{display: 'inline'}} height="48" /> 
                            : undefined 
                     }                     
                     <span className="brandLabel">{title}</span>
                  </a>
              </div>
              <div className="navbar-collapse collapse" id="navbar-collapsible">
                  <ul className="nav navbar-nav navbar-left">
                      {nav}
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                     <SelectField underlineStyle={{ borderColor: '#337ab7', borderBottom: 'solid 3px' }}
                                labelStyle={{ fontWeight: 600, color: '#2ebd59' }}
                                value={this.state.language}
                                autoWidth ={true}
                                style = {{width:'45px'}}
                                onChange={self.changeLanguage}>
                                 {this.state.supportedLanguages.map(function (lang) {
                                        return <MenuItem key={lang} value={lang} primaryText={lang} />                                
                                })}
                    </SelectField>
                  </ul>
              </div>
          </div>
     </nav>
      );
  },

  renderNav() {
      let siteKey = this.props.siteKey;
      return (
          <ul className="nav navbar-nav navbar-left">
              <li><Link to={`/site/${siteKey}/`}>Dashboard</Link></li>
              <li><Link to={`/site/${siteKey}/predictions/`}>Predictions</Link></li>
              <li><Link to={`/site/${siteKey}/facts/`}>Facts</Link></li>
          </ul>
      );
  }

});
