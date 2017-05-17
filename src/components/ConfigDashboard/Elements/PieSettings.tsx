import * as React from 'react';
import * as _ from 'lodash';
import FontIcon from 'react-md/lib/FontIcons';
import Switch from 'react-md/lib/SelectionControls/Switch';

import {BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';
export default class PieSettings extends BaseSettings{

    //abstract members implementation
    icon = "pie_chart";

    constructor(props: IBaseSettingsProps) {
        super(props);
        this.onShowLegendChange = this.onShowLegendChange.bind(this);
    }
    
    onShowLegendChange(checked:boolean){
        var s = this.state.stateSettings;
        s.props.showLegend = checked;
        this.setState({stateSettings:s});
    }

    renderChildren(){
        var { id, dependencies, actions, props, title, subtitle, size, theme, type } = this.state.stateSettings;
        return(
              <span className="md-cell md-cell--bottom  md-cell--6">
                  <div className="md-grid">
                      <span className="md-cell--1 md-cell--middle"><FontIcon>insert_chart</FontIcon></span>
                      <span className="md-cell--11 md-cell--bottom"><Switch id="props.showLegend" name="props.showLegend" label="Show legend" checked={props.showLegend} onChange={this.onShowLegendChange} /></span>
                  </div>
              </span>
        );
    }
}