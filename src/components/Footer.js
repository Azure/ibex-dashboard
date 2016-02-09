import React, { PropTypes, Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="Footer navbar-fixed-bottom">
        <div className="Footer-container">
          <span className="Footer-text"><img src="/dist/assets/images/MSFT_logo_png.png" height="39" width="117" /></span>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/">Home</a>
          <span className="Footer-spacer">·</span>
          <a className="Footer-link" href="/privacy">Privacy</a>
          <span className="Footer-spacer">·</span>
        </div>
      </footer>
    );
  }

}

export default Footer;
