import * as React from 'react';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Avatar from 'react-md/lib/Avatars';
import FontIcon from 'react-md/lib/FontIcons';
import InfoDrawer from '../../components/common/InfoDrawer';
import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';

export default class CosmosDBConnection implements IConnection {
  type = 'cosmos-db';
  params = ['host', 'key'];
  editor = CosmosDBConnectionEditor;
}

class CosmosDBConnectionEditor extends ConnectionEditor<IConnectionProps, any> {

  render() {
    let { connection } = this.props;
    // connection = connection || {'ssl':true };
    return (
      <Card className="md-grid hide-borders">
        <CardTitle 
          title="Cosmos DB" 
          avatar={<Avatar icon={<FontIcon>receipt</FontIcon>} />} 
          style={{ float: 'left'}}
        />
        <InfoDrawer
          width={300}
          title="CosmosDB"
          buttonIcon="help"
          buttonTooltip="Click here to learn more about CosmosDB"
        >
          <div className="md-toolbar-relative">
            <a href="https://azure.microsoft.com/en-us/services/cosmos-db/" target="_blank">Create Cosmos DB</a>
            <hr/>
            <a href="https://www.documentdb.com/sql/demo" target="_blank">Try CosmosDB demo queries</a>
          </div>
        </InfoDrawer>
        <TextField
          id="host"
          label={'Host'}
          defaultValue={connection['host'] || ''}
          lineDirection="center"
          placeholder="Fill in hostname"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
        <TextField
          id="key"
          label={'Key'}
          defaultValue={connection['key'] || ''}
          lineDirection="center"
          placeholder="Fill in Key"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
      </Card>
    );
  }

}
