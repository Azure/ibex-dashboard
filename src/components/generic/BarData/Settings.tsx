import * as React from 'react';

import FontIcon from 'react-md/lib/FontIcons';
import TextField from 'react-md/lib/TextFields';

import  {BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';

import settings from './Settings';

export default class BarDataSettings extends BaseSettings {
    
  editor = settings;

  icon = 'insert_chart';
  
  constructor(props: IBaseSettingsProps) {
    super(props);
    this.onParamChange = this.onParamChange.bind(this);
  } 

  onParamChange(value: string, event: any) {
    let { stateSettings } = this.state;
    let id = event.target.id;

    this.updateProperty(stateSettings, id, value);
    this.setState({ stateSettings });
  }

  renderChildren() {
    let { props } = this.state.stateSettings;
    return (
      <TextField
        id="props.nameKey"
        label="nameKey"
        placeholder="nameKey"
        leftIcon={<FontIcon>text_fields</FontIcon>}
        className="md-cell md-cell--bottom  md-cell--6"
        value={props.nameKey}
        onChange={this.onParamChange}
      />
    );
  }
}