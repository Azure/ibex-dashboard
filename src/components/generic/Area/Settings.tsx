import * as React from 'react';
import * as _ from 'lodash';

import FontIcon from 'react-md/lib/FontIcons';
import Switch from 'react-md/lib/SelectionControls/Switch';

import { BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';

export default class AreaSettings extends BaseSettings {

  // abstract members implementation
  icon = 'flip_to_front';

  constructor(props: IBaseSettingsProps) {
    super(props);

    this.onShowLegendChange = this.onShowLegendChange.bind(this);
  }
    
  onShowLegendChange(checked: boolean) {
    let { stateSettings } = this.state;
    stateSettings.props.showLegend = checked;
    this.setState({ stateSettings });
  }

  onIsStackedChange(checked: boolean) {
    let { stateSettings } = this.state;
    stateSettings.props.isStacked = checked;
    this.setState({ stateSettings });
  }

  renderChildren() {
    
    let { id, dependencies, actions, props, title, subtitle, size, theme, type } = this.state.stateSettings;
    
    return (
      <span >
        <span className="md-cell md-cell--bottom  md-cell--6">
          <div className="md-grid">
            <span className="md-cell--3 md-cell--middle"><FontIcon>insert_chart</FontIcon></span>
            <span className="md-cell--9 md-cell--bottom">
              <Switch 
                id="props.showLegend" 
                name="props.showLegend" 
                label="Show legend" 
                checked={props.showLegend} 
                onChange={this.onShowLegendChange} 
              />
            </span>
          </div>
        </span>
        <span className="md-cell md-cell--bottom  md-cell--6">
          <div className="md-grid">
            <span className="md-cell--3 md-cell--middle"><FontIcon>dns</FontIcon></span>
            <span className="md-cell--9 md-cell--bottom">
              <Switch 
                id="props.isStacked" 
                name="props.isStacked" 
                label="Is Stacked" 
                checked={props.isStacked} 
                onChange={this.onIsStackedChange} 
              />
            </span>
          </div>
        </span>
      </span>
    );
  }
}