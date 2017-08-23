import * as React from 'react';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Avatar from 'react-md/lib/Avatars';
import FontIcon from 'react-md/lib/FontIcons';
import InfoDrawer from '../../components/common/InfoDrawer';
import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';

export default class BotFrameworkConnection implements IConnection {
  type = 'bot-framework';
  params = ['directLine', 'conversationsEndpoint', 'webchatEndpoint'];
  editor = BotFrameworkEditor;
}

class BotFrameworkEditor extends ConnectionEditor<IConnectionProps, any> {

  render() {
    let { connection } = this.props;
    return (
      <Card className="md-grid hide-borders">
        <CardTitle 
          title="Bot Framework" 
          avatar={<Avatar icon={<FontIcon>receipt</FontIcon>} />} 
          style={{ float: 'left'}}
        />
        <InfoDrawer
          width={300}
          title="Bot Framework"
          buttonIcon="help"
          buttonTooltip="Click here to learn more about Bot Framework"
        >
          <div className="md-toolbar-relative">
            <span>More about </span>
            <a href="https://dev.botframework.com" target="_blank">Bot Framework</a>
            <span> and </span>
            <a href="https://docs.botframework.com/en-us/restapi/directline3/#navtitle" target="_blank">Direct Line</a>
            <hr />
            <h3>Localhost development</h3>
            <ul className="aligned">
              <li>
                <h6>Conversations Endpoint</h6>
                <pre>https://********.ngrok.io/api/conversations</pre>
              </li>
              <li>
                <h6>Webchat (Agent) Endpoint</h6>
                <pre>http://localhost:3978/webchat</pre>
              </li>
            </ul>
          </div>
        </InfoDrawer>
        <TextField
          id="directLine"
          label={'Direct Line secret key'}
          defaultValue={connection['directLine'] || ''}
          lineDirection="center"
          placeholder="Fill in Direct Line secret key"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
        <TextField
          id="conversationsEndpoint"
          label={'Conversations Endpoint'}
          defaultValue={connection['conversationsEndpoint'] || ''}
          lineDirection="center"
          placeholder="Conversations Endpoint"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
        <TextField
          id="webchatEndpoint"
          label={'Webchat (Agent) Endpoint'}
          defaultValue={connection['webchatEndpoint'] || ''}
          lineDirection="center"
          placeholder="Webchat Endpoint"
          className="md-cell--stretch"
          onChange={this.onParamChange}
        />
      </Card>
    );
  }

}
