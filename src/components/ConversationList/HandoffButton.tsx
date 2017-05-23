import * as React from 'react';
import * as request from 'xhr-request';
import * as _ from 'lodash';
import Button from 'react-md/lib/Buttons/Button';

export interface IHandoffProps {
  convoData: any
}

export default class Handoff extends React.Component<IHandoffProps, any> {

  constructor(props: any) {
    super(props);
    this.onHandoff = this.onHandoff.bind(this);
  }

  onHandoff() {
    let { convoData } = this.props;

    request('https://directline.botframework.com/v3/directline/conversations', {
      method: 'POST',
      json: true,
      headers: { 'Authorization': 'Bearer RIwzhEOaDNk.cwA.n-s.qfG-5Vv9jD9TznQfXTR8d1dsgJRDBfSzl-B7svxhe5o' },
    }, function (err, data) {
      if (err) throw err

      console.log('got result: ', data)

      const conversationurl = `https://directline.botframework.com/v3/directline/conversations/${data.conversationId}/activities`;

      request(conversationurl, {
        method: 'POST',
        json: true,
        body: { "type": "message", "from": {"id": "Operator", "name": "Operator"}, "text": "Ibex Hand Off Init", "sourceEvent": convoData},
        headers: { 'Authorization': `Bearer ${data.token}` },
      }, function (err, data) {
        if (err) throw err
        console.log('got result: ', data)
      })
    })
  }

  render() {
    return (
      <Button flat primary label="Transfer to Agent" onClick={this.onHandoff}></Button>
    );
  }
}

