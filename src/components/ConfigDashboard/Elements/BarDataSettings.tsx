import * as React from 'react';
import * as _ from 'lodash';
import FontIcon from 'react-md/lib/FontIcons';
import Switch from 'react-md/lib/SelectionControls/Switch';
import TextField from 'react-md/lib/TextFields';
import BaseSettings from '../../common/BaseSettingsComponent';

interface IBarDataSettingsProps{
    settings: IElement,
    shouldSave: boolean
}
interface IBarDataSettingsState{ 
    stateSettings:IElement //we need to persist the changes in state until a save is requested
}

export default class BarDataSettings extends React.Component<IBarDataSettingsProps,IBarDataSettingsState>{
    constructor(props: IBarDataSettingsProps) {
        super(props);
        this.onParamChange = this.onParamChange.bind(this);
    }
    
    state:IBarDataSettingsState ={
        stateSettings:this.props.settings
    }

    onParamChange(value: string, event: any) {
        var s = this.state.stateSettings;
        var id = event.target.id;
        this.updateProperty(s,id,value);
        this.setState({stateSettings:s});
    }

    updateProperty (object:any, property: string, value: any) {
        let arr = property.split('.');
        let parent: any;
        let key: string;
        while (arr.length && (parent = object) && (key = arr.shift()) && (object = object[key])) { }
          if (parent) {
            parent[key] = value;
        }
    }

    render(){
        var { id, dependencies, actions, props, title, subtitle, size, theme, type } = this.state.stateSettings;
        return(
          <BaseSettings fonticon={"insert_chart"} settings={this.props.settings} shouldSave={this.props.shouldSave} >
              <TextField
                            id="props.nameKey"
                            label="nameKey"
                            placeholder="nameKey"
                            leftIcon={<FontIcon>text_fields</FontIcon>}
                            className="md-cell md-cell--bottom  md-cell--6"
                            value={props.nameKey}
                            onChange={this.onParamChange}
                            />
          </BaseSettings>
            
        );
    }
}