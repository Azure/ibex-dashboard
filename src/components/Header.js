import React from 'react';
import '../styles/Header.css';
import { Link } from 'react-router';

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
                      <li className="userProfile">
                        <span className="fa-stack fa-lg">
                          <i className="fa fa-square fa-stack-2x"></i>
                          <i className="fa fa-stack-1x fa-inverse" style={{color: '#222931', fontWeight: '600', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif'}}>
                            
                          </i>
                        </span>
                      </li>
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
