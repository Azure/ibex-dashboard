import * as React from 'react';
import * as request from 'xhr-request';
import * as _ from 'lodash';
import Button from 'react-md/lib/Buttons/Button';

export interface IHandoffProps {
  convoData: any;
}

export default class Handoff extends React.Component<IHandoffProps, any> {
  constructor(props: any) {
    super(props);
    this.onHandoff = this.onHandoff.bind(this);
  }

  onHandoff() {
    let { convoData } = this.props;

    // Should pull the dl secret from bot config
    let directlineSecret = 'RIwzhEOaDNk.cwA.n-s.qfG-5Vv9jD9TznQfXTR8d1dsgJRDBfSzl-B7svxhe5o';

    // Needs to be bot url, do we get that in config?
    request('http://ef2a2407.ngrok.io/api/conversations', 
    {
      method: 'POST',
      json: true,
      body: { 'conversationId': convoData.conversation.id},
      headers: { 'Authorization': 'Bearer ' + directlineSecret},
    }, 
    function (err: any, data: any) {
      if (err) { throw err; }
    });
  }

  render() {
    return (
      <Button flat primary label="Transfer to Agent" onClick={this.onHandoff} />
    );
  }
}