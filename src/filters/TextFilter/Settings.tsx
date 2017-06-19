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

export default class TextFilterSettings extends BaseFilterSettings<IBaseSettingsState> {

  icon = 'radio_button_checked';
  state = {
  };

  constructor(props: IBaseSettingsProps) {
    super(props);
  }

  renderChildren() {
    let dependencies = this.props.settings.dependencies;
    return (
      <span className="md-cell md-cell--bottom  md-cell--12">
      </span>
    );
  }
}