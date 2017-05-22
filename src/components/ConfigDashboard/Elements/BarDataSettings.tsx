import * as React from 'react';
import FontIcon from 'react-md/lib/FontIcons';
import TextField from 'react-md/lib/TextFields';
import  {BaseSettings, IBaseSettingsProps, IBaseSettingsState } from '../../common/BaseSettingsComponent';

export default class BarDataSettings extends BaseSettings{
    
    //abstract members implementation
    icon = "insert_chart";
    
    constructor(props: IBaseSettingsProps) {
        super(props);
        this.onParamChange = this.onParamChange.bind(this);
    } 
 
    onParamChange(value: string, event: any) {
        var s = this.state.stateSettings;
        var id = event.target.id;
        this.updateProperty(s,id,value);
        this.setState({stateSettings:s});
    }

    renderChildren() {
      var { props } = this.state.stateSettings;
        return(
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