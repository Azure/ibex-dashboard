import * as React from 'react';
import * as _ from 'lodash';

import FontIcon from 'react-md/lib/FontIcons';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';

import { BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettings';
import ArrayInput from '../../common/ArrayInput';
import { ToastActions } from '../../Toast';

export default class ScorecardSettings extends BaseSettings {

  icon = 'timelapse';

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
    let { stateSettings } = this.state;
    let { id, dependencies, actions, props, title, subtitle, size, theme, type } = stateSettings;

    return (
      <span className="md-cell md-cell--bottom  md-cell--12 md-grid">
        <TextField
          id="props.xDataKey"
          label="xDataKey"
          placeholder="xDataKey"
          leftIcon={<FontIcon>tune</FontIcon>}
          className="md-cell md-cell--bottom  md-cell--6"
          value={props.xDataKey}
          onChange={this.onParamChange}
        />
        <TextField
          id="props.yDataKey"
          label="yDataKey"
          placeholder="yDataKey"
          leftIcon={<FontIcon>tune</FontIcon>}
          className="md-cell md-cell--bottom  md-cell--6"
          value={props.yDataKey}
          onChange={this.onParamChange}
        />
        <TextField
          id="props.zDataKey"
          label="zDataKey"
          placeholder="zDataKey"
          leftIcon={<FontIcon>tune</FontIcon>}
          className="md-cell md-cell--bottom  md-cell--6"
          value={props.zDataKey}
          onChange={this.onParamChange}
        />
        
        <div className="md-cell md-cell--bottom  md-cell--6">
          <div className="md-grid">
            <TextField
              id="props.zRange.0"
              label="Range Min"
              placeholder="10"
              className="md-cell md-cell--bottom  md-cell--6"
              value={props.zRange[0]}
              onChange={this.onRangeParamChange}
              leftIcon={<FontIcon>vertical_align_bottom</FontIcon>}
            />
            <TextField
              id="props.zRange.1"
              label="Range Max"
              placeholder="500"
              className="md-cell md-cell--bottom  md-cell--6"
              value={props.zRange[1]}
              onChange={this.onRangeParamChange}
              leftIcon={<FontIcon>vertical_align_top</FontIcon>}
            />
          </div>
        </div>
      </span>
    );
  }
}