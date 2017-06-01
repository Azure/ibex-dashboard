import * as React from 'react';
import * as _ from 'lodash';

import Chip from 'react-md/lib/Chips';
import FontIcon from 'react-md/lib/FontIcons';
import Paper from 'react-md/lib/Papers';
import Divider from 'react-md/lib/Dividers';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import SelectField from 'react-md/lib/SelectFields';

import { BaseDatasourceSettings, IBaseSettingsProps, IBaseSettingsState } 
                from '../../../components/common/BaseDatasourceSettings';

export default class ConstantDatasourceSettings extends BaseDatasourceSettings<IBaseSettingsState> {

  icon = 'chrome_reader_mode';
  state = {
    keyIndex: 0,
    tokens: [],
    newToken: '',
    selectedToken: ''
  };

  constructor(props: IBaseSettingsProps) {
    super(props);
    this.removeToken = this.removeToken.bind(this);
    this.addToken = this.addToken.bind(this);
    this.onNewTokenChange = this.onNewTokenChange.bind(this);
    this.selectedTokenChange = this.selectedTokenChange.bind(this);
    this.state.keyIndex = 0;
    this.state.tokens = this.props.settings.params['values'];
    this.state.selectedToken = this.props.settings.params['selectedValue'];
  }

  removeToken(token: String) {
    var tokens = this.state.tokens;
    _.remove(tokens, function (x: String) {
      return x === token;
    });
    this.setState({ tokens: tokens });
    var selected = this.state.selectedToken;
    
    if (!_.find(tokens, function(x: any) {
      return x === selected;
    })) {
      // the selected value was removed, thus, we set it to default
      this.setState({ selectedToken: tokens[0] });
    }
  }

  addToken() {
    if (this.state.newToken) {
      var arr = this.state.tokens;
      arr.push(this.state.newToken);
      this.setState({
        tokens: arr,
        newToken: ''
      });
    }
  }

  onNewTokenChange(data: any, e: any) {
    this.setState({newToken: data});
  }

  selectedTokenChange(newValue: any) {
    this.setState({ selectedToken: newValue });
    this.props.settings.params['selectedValue'] = newValue;
  }

  renderChildren() {
    let { settings } = this.props;
    let { id, dependencies, params,  type } = settings;
    let { tokens, selectedToken } = this.state;
    let chips = tokens.map((token: String) => (
      <Chip
        onClick={this.removeToken.bind(this, token)}
        removable
        label={token}
        key={this.state.keyIndex++}
      />
    ));

    return (
        <span className="md-cell md-cell--bottom  md-cell--12">
          <div className="md-grid">
            <span className="md-cell--3 md-cell--middle">
              <span className="md-caption" style={{padding: 5}}>values:</span>
            </span>
            <span className="md-cell--9 md-cell--bottom">
            <Paper key={this.state.keyIndex++} zDepth={0} >

              <div style={{ padding: 5 }}>
                {chips}
              </div>
              <Divider />
              <div className="md-grid">
                <TextField
                  id="floatingCenterTitle"
                  lineDirection="center"
                  placeholder="Add a value"
                  className="md-cell md-cell--bottom"
                  value={this.state.newToken}
                  onChange={this.onNewTokenChange}
                />
                <Button icon primary onClick={this.addToken} className="md-cell">add_circle</Button>
              </div>
              
            </Paper>
          </span>
          </div>
          <div className="md-grid">
            <span className="md-cell--3 md-cell--middle">
              <span className="md-caption" style={{padding: 5}}>selected value:</span>
            </span>
            <span className="md-cell--9 md-cell--bottom">
              <SelectField
                id="selectedValue"
                value={selectedToken}
                menuItems={tokens}
                className="md-cell"
                onChange={this.selectedTokenChange}
              />
            </span>
          </div>
        </span>
    );
  }
}