import * as React from 'react';
import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';
import InfoDrawer from '../../components/common/InfoDrawer';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

export default class MongoDBConnection implements IConnection {
  type = 'mongodb';
  params = ['host', 'port', 'username', 'password', 'ssl'];
  editor = MongoDBConnectionEditor;
}


class MongoDBConnectionEditor extends ConnectionEditor<IConnectionProps, any> {

  constructor(props: IConnectionProps) {
    super(props);
    this.onParamChange = this.onParamChange.bind(this);
  }

  onParamChange(value: string, event: any) {
    if (typeof this.props.onParamChange === 'function') {
      this.props.onParamChange('mongodb', event.target.id, value);
    }
  }

  render() {
    let { connection } = this.props;
    connection = connection || {'ssl':true };
    return (
      <div>
        <h2 style={{ float: 'left', padding: 9 }}>MongoDB</h2>
        <InfoDrawer
          width={300}
          title='Authentication'
          buttonIcon='help'
          buttonTooltip='Click here to learn more about authentications'
        >
          <div>
            I lied. Click <a href='https://docs.mongodb.com/manual/core/authentication/' target='_blank'>here</a> to
             learn more about MongoDB authentication.
            <hr/>
            Sorry.
          </div>
        </InfoDrawer>
        <TextField
          id="host"
          label={'Host'}
          defaultValue={connection['host'] || ''}
          lineDirection="center"
          placeholder="Fill in hostname"
          className="md-cell md-cell--bottom"
          onChange={this.onParamChange}
        />
        <TextField
          id="port"
          label={'Port'}
          defaultValue={connection['port'] || ''}
          lineDirection="center"
          placeholder="Fill in MongoDB port"
          className="md-cell md-cell--bottom"
          onChange={this.onParamChange}
        />
        <TextField
          id="username"
          label={'Username'}
          defaultValue={connection['username'] || ''}
          lineDirection="center"
          placeholder="Fill in username"
          className="md-cell md-cell--bottom"
          onChange={this.onParamChange}
        />
        <TextField
          id="password"
          label={'Password'}
          defaultValue={connection['password'] || ''}
          lineDirection="center"
          placeholder="Fill in password"
          className="md-cell md-cell--bottom"
          onChange={this.onParamChange}
        />
        <Checkbox
          id="ssl"
          label={'Use SSL?'}
          defaultChecked={connection['ssl']}
          className="md-cell md-cell--bottom"
          onChange={this.onParamChange}
        />
      </div>
    );
  }

}
