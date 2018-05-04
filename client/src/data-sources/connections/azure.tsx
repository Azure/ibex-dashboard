import * as React from 'react';
import TextField from 'react-md/lib/TextFields';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Avatar from 'react-md/lib/Avatars';
import FontIcon from 'react-md/lib/FontIcons';
import InfoDrawer from '../../components/common/InfoDrawer';
import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';

export default class AzureConnection implements IConnection {
  type = 'azure';
  params = [ 'servicePrincipalId', 'servicePrincipalKey', 'servicePrincipalDomain', 'subscriptionId' ];
  editor = AzureConnectionEditor;
}

class AzureConnectionEditor extends ConnectionEditor<IConnectionProps, any> {

  render() {

    let { connection } = this.props;
    connection = connection || {};

    let servicePrincipalUrl = 
      'https://docs.microsoft.com/en-us/azure/azure-resource-manager/' + 
      'resource-group-create-service-principal-portal';

    return (
      <Card className="md-grid hide-borders">
        <CardTitle 
          title="Azure Connection" 
          avatar={<Avatar icon={<FontIcon>receipt</FontIcon>} />} 
          style={{ float: 'left'}}
        />
        <InfoDrawer 
          width={300} 
          title="Authentication"
          buttonIcon="help"
          buttonTooltip="Click here to learn more about authentications"
        >
          <div className="md-toolbar-relative">
            Follow the instructions
            in <a href={servicePrincipalUrl} target="_blank">this link</a> to
            get <b>Service Principal ID</b> and <b>Service Principal Key</b>
            <hr/>
            This setup will create credentials for the dashboard to query resources from Azure.
          </div>
        </InfoDrawer>
        <TextField
          id="servicePrincipalId"
          label={'Service Principal Id'}
          defaultValue={connection['servicePrincipalId'] || ''}
          lineDirection="center"
          placeholder="Fill in Service Principal Id"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
        <TextField
          id="servicePrincipalKey"
          label={'Service Principal Key'}
          defaultValue={connection['servicePrincipalKey'] || ''}
          lineDirection="center"
          placeholder="Fill in Service Principal Key"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
        
        <TextField
          id="servicePrincipalDomain"
          label={'Service Principal Domain'}
          defaultValue={connection['servicePrincipalDomain'] || ''}
          lineDirection="center"
          placeholder="Fill in Service Principal Domain"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
        <TextField
          id="subscriptionId"
          label={'Subscription Id'}
          defaultValue={connection['subscriptionId'] || ''}
          lineDirection="center"
          placeholder="Fill in Subscription Id"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
      </Card>
    );
  }
}