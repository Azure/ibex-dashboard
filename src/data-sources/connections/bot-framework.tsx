import * as React from 'react';
import { IConnection, ConnectionEditor, IConnectionProps } from './Connection';
import InfoDrawer from '../../components/common/InfoDrawer';
import TextField from 'react-md/lib/TextFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

export default class BotFrameworkConnection implements IConnection {
  type = 'bot-framework';
  params = ['directLine','conversationsEndpoint'];
  editor = BotFrameworkEditor;
}

class BotFrameworkEditor extends ConnectionEditor<IConnectionProps, any> {

  constructor(props: IConnectionProps) {
    super(props);
    this.onParamChange = this.onParamChange.bind(this);
  }

  onParamChange(value: string, event: any) {
    if (typeof this.props.onParamChange === 'function') {
      this.props.onParamChange('bot-framework', event.target.id, value);
    }
  }

  render() {
    let { connection } = this.props;
    return (
      <div>
        <h2 style={{ float: 'left', padding: 9 }}>Bot Framework</h2>
        <InfoDrawer
          width={300}
          title="Bot Framework"
          buttonIcon="help"
          buttonTooltip="Click here to learn more about Bot Framework"
        >
          <div>
            <span>More about </span>
            <a href="https://dev.botframework.com" target="_blank">Bot Framework</a>
            <span> and </span>
            <a href="https://docs.botframework.com/en-us/restapi/directline3/#navtitle" target="_blank">Direct Line</a>
            <hr />
            <p>Notes</p>
            <ul>
              <li>
                <h6>Conversations Endpoint</h6>
                <p>Is very similar to the Bot Messaging Endpoint except it ends with '/api/conversations'.</p>
              </li>
            </ul>
          </div>
        </InfoDrawer>
        <TextField
          id="directLine"
          label={'Direct Line secret'}
          defaultValue={connection['directLine'] || ''}
          lineDirection="center"
          placeholder="Fill in Direct Line secret"
          className="md-cell md-cell--bottom"
          onChange={this.onParamChange}
        />
        <TextField
          id="conversationsEndpoint"
          label={'Conversations Endpoint'}
          defaultValue={connection['conversationsEndpoint'] || ''}
          lineDirection="center"
          placeholder="Fill in Conversations Endpoint"
          className="md-cell md-cell--bottom"
          onChange={this.onParamChange}
        />
      </div>
    );
  }

}
