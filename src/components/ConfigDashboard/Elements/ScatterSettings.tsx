import * as React from 'react';
import * as _ from 'lodash';

import FontIcon from 'react-md/lib/FontIcons';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import { BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';
import ArrayInput from '../../common/ArrayInput';
import { ToastActions } from '../../Toast';

export default class ScatterSettings extends BaseSettings {

  // abstract members implementation
  icon = 'bubble_chart';

  constructor(props: IBaseSettingsProps) {
    super(props);

    this.onParamChange = this.onParamChange.bind(this);
    this.onRangeParamChange = this.onRangeParamChange.bind(this);
  }
  
  onParamChange(value: string, event: any) {
    var { stateSettings } = this.state;
    var id = event.target.id;

    this.updateProperty(stateSettings, id, value);
    this.setState({ stateSettings });
  }

  onParamSelectChange(newValue: string, newActiveIndex: number, event: any) {

    // a little hacking to get the id of the parent, 
    // because event does not contain the outer element, but only the inner li
    let { stateSettings } = this.state;
    let cur = event.target;

    while (cur && !cur.classList.contains('ddl')) {
      cur = cur.parentNode;
    }

    if (cur) {
      cur = cur.querySelector('input');
      var id = cur.id;
      this.updateProperty(stateSettings, id, newValue);
      this.setState({ stateSettings });
    }
  }
  
  onRangeParamChange(value: string, event: any) {

    try {
      let { stateSettings } = this.state;
      let idx = _.toNumber(_.replace(event.target.id, 'props.zRange.', ''));
      stateSettings.props.zRange[idx] = _.toNumber(value);

      this.setState({ stateSettings });

    } catch (e) {
      ToastActions.showText('onRangeParamChange failed to update value. ' + e);
    }
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