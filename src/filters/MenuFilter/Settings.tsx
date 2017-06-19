import * as React from 'react';
import * as _ from 'lodash';

import Chip from 'react-md/lib/Chips';
import FontIcon from 'react-md/lib/FontIcons';
import Paper from 'react-md/lib/Papers';
import Divider from 'react-md/lib/Dividers';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import SelectField from 'react-md/lib/SelectFields';

import { BaseFilterSettings, IBaseSettingsProps, IBaseSettingsState } 
                from '../../components/common/BaseFilterSettings'

export default class MenuFilterSettings extends BaseFilterSettings<IBaseSettingsState> {

  icon = 'check_box';
  state = {
  };

  constructor(props: IBaseSettingsProps) {
    super(props);
  }

  renderChildren() {
    let {subtitle, icon} = this.props.settings;
    return (
      <span className="md-cell md-cell--bottom  md-cell--12">
        <TextField
          id="subtitle"
          label="subtitle"
          placeholder="subtitle"
          leftIcon={<FontIcon>title</FontIcon>}
          className="md-cell md-cell--bottom  md-cell--6"
          value={subtitle}
          onChange={this.onParamChange}
        />
        <TextField
          id="icon"
          label="icon"
          placeholder="icon"
          leftIcon={<FontIcon>{icon}</FontIcon>}
          className="md-cell md-cell--bottom  md-cell--6"
          value={icon}
          onChange={this.onParamChange}
        />
      </span>
    );
  }
}