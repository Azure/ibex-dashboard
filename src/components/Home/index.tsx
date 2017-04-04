import * as React from 'react';
import Button from 'react-md/lib/Buttons/Button';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import { Link } from 'react-router';

import InfoDrawer from '../common/InfoDrawer';

import SetupActions from '../../actions/SetupActions';
import SetupStore from '../../stores/SetupStore';

import ConfigurationActions from '../../actions/ConfigurationsActions';
import ConfigurationStore from '../../stores/ConfigurationsStore';

interface IHomeState extends ISetupConfig {
  loaded?: boolean;
}

export default class Home extends React.Component<any, IHomeState> {

  state: IHomeState = {
    admins: null,
    stage: 'none',
    enableAuthentication: false,
    allowHttp: false,
    redirectUrl: '',
    clientID: '',
    clientSecret: '',
    loaded: false
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {

    this.setState(SetupStore.getState());

    SetupActions.load();
    SetupStore.listen(state => {
      this.setState(state);
      
      // Setup hasn't been configured yet
      if (state.stage === 'none') {
        window.location.replace('/setup');
      }
    });
  }

  render() {

    let { admins, loaded, enableAuthentication, redirectUrl, clientID, clientSecret } = this.state;

    if (!redirectUrl) {
      redirectUrl = window.location.protocol + '//' + window.location.host + '/auth/openid/return';
    }

    if (!loaded) {
      return <CircularProgress key="progress" id="contentLoadingProgress" />;
    }

    return (
      <div style={{ width: '100%' }}>
        Setup was completed. You can open one of the following dashboards...
        <Link href="/dashboard" to={null}>
          <a className='md-list-tile md-list-tile--mini' style={{width: '100%', overflow: 'hidden'}}>
            Dashboard
          </a>
        </Link>
        <Link href="/new-dashboard" to={null}>
          <a className='md-list-tile md-list-tile--mini' style={{width: '100%', overflow: 'hidden'}}>
            Create a new dashboard (Not active yet)
          </a>
        </Link>
      </div>
    );
  }
}
