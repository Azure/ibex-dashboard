import * as React from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Avatar from 'react-md/lib/Avatars';
import FontIcon from 'react-md/lib/FontIcons';
import TextField from 'react-md/lib/TextFields';
import InfoDrawer from '../../components/common/InfoDrawer';
import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';

export default class GraphQLConnection implements IConnection {
  type = 'graphql';
  params = [ 'serviceUrl' ];
  editor = GraphQLConnectionEditor;
}

class GraphQLConnectionEditor extends ConnectionEditor<IConnectionProps, any> {

  constructor(props: IConnectionProps) {
    super(props);

    this.onParamChange = this.onParamChange.bind(this);
  }

  onParamChange(value: string, event: any) {
    if (typeof this.props.onParamChange === 'function') {
      this.props.onParamChange(event.target.id, value);
    }
  }

  render() {
    let { connection } = this.props;
    connection = connection || {};

    return (
      <Card className="md-grid hide-borders">
        <CardTitle 
          title="GraphQL Connection" 
          avatar={<Avatar icon={<FontIcon>receipt</FontIcon>} />} 
          style={{ float: 'left'}}
        />
        <InfoDrawer
          width={300}
          title="GraphQL"
          buttonIcon="help"
          buttonTooltip="Click here to learn more about GraphQL"
        >
          <div className="md-toolbar-relative">
            Just enter the URL of the GraphQL service you wish to query below.
            Currently only publicly accessible GraphQL endpoints are supported.
          </div>
        </InfoDrawer>
        <TextField
          id="serviceUrl"
          label={'Service URL'}
          defaultValue={connection['serviceUrl'] || ''}
          lineDirection="center"
          placeholder="Fill in Service URL"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
      </Card>
    );
  }
}