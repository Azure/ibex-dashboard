import * as React from 'react';
import * as _ from 'lodash';
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons';
import TextField from 'react-md/lib/TextFields';
import Chip from 'react-md/lib/Chips';
import Divider from 'react-md/lib/Dividers';

interface ITokenInputProps {
  tokens: any[];
  zDepth: number;
  onTokensChanged(): void;
};

interface ITokenInputState {
  newToken: any;
};

export default class TokenInput extends React.Component<ITokenInputProps, ITokenInputState>{

  state: ITokenInputState = {
    newToken: ''
  }

  constructor(props: ITokenInputProps) {
    super(props);
    this.removeToken = this.removeToken.bind(this);
    this.onNewTokenChange = this.onNewTokenChange.bind(this);
    this.addToken = this.addToken.bind(this);
  }

  removeToken(token: any) {
    var tokens = this.props.tokens;
    _.remove(tokens, function (x: String) {
      return x === token;
    });
    this.props.onTokensChanged();
  }

  onNewTokenChange(newData) {
    this.setState({ newToken: newData });
  }

  addToken() {
    if (this.state.newToken) {
      var arr = this.props.tokens;
      arr.push(this.state.newToken);
      this.setState({
        newToken: ''
      });
      this.props.onTokensChanged();
    }
  }

  render() {
    let { tokens, zDepth } = this.props;
    let { newToken } = this.state;

    let chips = tokens.map((token: string, index: number) => (
      <Chip
        key={index}
        onClick={this.removeToken.bind(this, token)}
        removable
        label={token}
      />
    ));

    return (
      <Paper zDepth={zDepth} >
        <div style={{ padding: 5 }}>
          {chips}
        </div>
        <Divider />
        <div className="md-grid">
          <TextField
            id="addTokenInput"
            lineDirection="center"
            placeholder="Add a value"
            className="md-cell md-cell--bottom"
            value={newToken}
            onChange={this.onNewTokenChange}
          />
          <Button icon primary onClick={this.addToken} className="md-cell">add_circle</Button>
        </div>
      </Paper>
    );
  }
};