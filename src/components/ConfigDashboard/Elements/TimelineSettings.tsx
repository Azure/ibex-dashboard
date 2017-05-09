import * as React from 'react';
import * as _ from 'lodash';

import BaseSettings from '../../common/BaseSettingsComponent';

interface ITimelineSettingsProps{
    settings: IElement,
    shouldSave: boolean
}
interface ITimelineSettingsState{ 
    stateSettings:IElement //we need to persist the changes in state until a save is requested
}

export default class TimelineSettings extends React.Component<ITimelineSettingsProps,ITimelineSettingsState>{
    constructor(props: ITimelineSettingsProps) {
        super(props);
    }
    
    state:ITimelineSettingsState ={
        stateSettings:this.props.settings
    }
    

    render(){
        return(
            <BaseSettings fonticon={"timeline"} settings={this.props.settings} shouldSave={this.props.shouldSave} />
        );
    }
}