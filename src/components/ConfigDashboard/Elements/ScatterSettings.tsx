import * as React from 'react';
import * as _ from 'lodash';
import FontIcon from 'react-md/lib/FontIcons';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import BaseSettings from '../../common/BaseSettingsComponent';
import ArrayInput from '../../common/ArrayInput';

interface IScatterSettingsProps{
    settings: IElement,
    shouldSave: boolean
}
interface IScatterSettingsState{ 
    stateSettings:IElement //we need to persist the changes in state until a save is requested
}

export default class ScatterSettings extends React.Component<IScatterSettingsProps,IScatterSettingsState>{
    constructor(props: IScatterSettingsProps) {
        super(props);
        this.onParamChange = this.onParamChange.bind(this);
        this.onRangeParamChange = this.onRangeParamChange.bind(this);
    }
    
    state:IScatterSettingsState ={
        stateSettings:this.props.settings
    }
    
    onParamChange(value: string, event: any) {
        var s = this.state.stateSettings;
        var id = event.target.id;
        this.updateProperty(s,id,value);
        this.setState({stateSettings:s});
    }
    onParamSelectChange(newValue: string,newActiveIndex:number, event: any) {
 
           //a little hacking to get the id of the parent, because event does not contain the outer element, but only the inner li
        var s = this.state.stateSettings;
        var cur = event.target;
        while(cur && !cur.classList.contains('ddl')){
            cur = cur.parentNode;
        }
        if(cur) {
            cur = cur.querySelector('input');
            var id = cur.id;
            this.updateProperty(s,id,newValue);
            this.setState({stateSettings:s});
        }
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

    onRangeParamChange(value: string, event: any) {
        try{
        var s = this.state.stateSettings;
        var idx =_.toNumber(_.replace(event.target.id,"props.zRange.",""));
        s.props.zRange[idx] = _.toNumber(value);
        this.setState({stateSettings:s});
      }
      catch(e){
          console.log("onRangeParamChange  failed to update value. "+e);
      }
    }

    render(){
        var { id, dependencies, actions, props, title, subtitle, size, theme, type } = this.state.stateSettings;
        return(
          <BaseSettings fonticon={"bubble_chart"} settings={this.props.settings} shouldSave={this.props.shouldSave} >
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
          </BaseSettings>
            
        );
    }
}