import * as React from 'react';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Avatar from 'react-md/lib/Avatars';
import FontIcon from 'react-md/lib/FontIcons';

import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';
import InfoDrawer from '../../components/common/InfoDrawer';

/** 
 * This class is used to define the parameters for the connection
 * as well as the editor for the connection
 */
export default class KustoConnection implements IConnection {
  type = 'kusto';
  params = [ 'clusterName', 'databaseName' ];
  editor = KustoConnectionEditor;
}

/**
 * Implementation of the Kusto editor
 */
class KustoConnectionEditor extends ConnectionEditor<IConnectionProps, any> {
  public render() {
    let { connection } = this.props;

    return (
      <Card className="md-grid hide-borders">
        <CardTitle 
          title="Kusto" 
          avatar={<Avatar icon={<FontIcon>receipt</FontIcon>} />} 
          style={{ float: 'left'}}
        />
        <InfoDrawer
          width={300}
          title="Kusto"
          buttonIcon="help"
          buttonTooltip="Click here to learn more about Kusto"
        >
          <div className="md-toolbar-relative">
            <a href="https://aka.ms/kusto" target="_blank">Learn more about Kusto</a>
          </div>
        </InfoDrawer>
        <TextField
          id="cluster"
          label={'Cluster Name'}
          defaultValue={connection['clusterName'] || ''}
          lineDirection="center"
          placeholder="Fill in hostname"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
        <TextField
          id="database"
          label={'Database Name'}
          defaultValue={connection['databaseName'] || ''}
          lineDirection="center"
          placeholder="Fill in Key"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
      </Card>
    );
  }
}